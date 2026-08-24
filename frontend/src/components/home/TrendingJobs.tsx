'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/lib/axiosInstance';
import {
  ArrowRight,
  Briefcase,
  Building2,
  ChevronRight,
  Clock3,
  Eye,
  MapPin,
  Pause,
  Play,
  TrendingUp,
  Users,
} from 'lucide-react';

interface Job {
  _id: string;
  jobType: string;
  jobTitle: string[];
  companyName?: string;
  companyPosted?: string;
  location: string[];
  workLocation: string[];
  packageDetails: {
    currency: string;
    totalCTC?: number;
    fixedPay?: number;
    joiningBonus?: number;
  };
  employmentType: string[];
  workMode: string[];
  description: string;
  jobRoles: string[];
  skills: string[];
  degree: string[];
  applicationCount: number;
  views: number;
  createdAt: string;
  expireAt?: string;
  approvalStatus: string;
  jobStatus: string;
}

interface TrendingJob {
  applicationCount: number;
  job: Job;
  jobId: string;
}

const MAX_VISIBLE_JOBS = 6;
const MAX_VISIBLE_SKILLS = 3;
const AUTO_PLAY_MS = 4000;

const TrendingJobs = () => {
  const [jobs, setJobs] = useState<TrendingJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [hoveredJob, setHoveredJob] = useState<string | null>(null);

  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const router = useRouter();

  useEffect(() => {
    void fetchTrendingJobs();

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
      autoPlayRef.current = null;
    }

    if (jobs.length <= 1 || !isAutoPlaying) {
      return;
    }

    autoPlayRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % jobs.length);
    }, AUTO_PLAY_MS);

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
        autoPlayRef.current = null;
      }
    };
  }, [jobs.length, isAutoPlaying]);

  useEffect(() => {
    if (currentIndex >= jobs.length && jobs.length > 0) {
      setCurrentIndex(0);
    }
  }, [currentIndex, jobs.length]);

  const fetchTrendingJobs = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axiosInstance.get('/jobs/trending');

      if (response.data?.success) {
        setJobs(Array.isArray(response.data.trendingJobs) ? response.data.trendingJobs : []);
        setCurrentIndex(0);
      } else {
        setError('Unable to load trending jobs.');
      }
    } catch (err) {
      console.error('Error fetching trending jobs:', err);
      setError('Unable to load trending jobs right now.');
    } finally {
      setLoading(false);
    }
  };

  const handleJobClick = (jobId: string) => {
    router.push(`/jobs/${jobId}`);
  };

  const getJobTypeBadge = (jobType?: string) => {
    const value = jobType?.trim().toLowerCase() || '';

    const types: Record<string, { className: string; label: string }> = {
      referral: {
        className: 'badge-primary',
        label: 'Referral',
      },
      'pool-campus': {
        className: 'badge-info',
        label: 'Pool Campus',
      },
      'on-campus': {
        className: 'badge-warning',
        label: 'On Campus',
      },
    };

    return (
      types[value] || {
        className: 'badge',
        label: jobType || 'Opportunity',
      }
    );
  };

  const getWorkModeBadge = (workMode?: string[]) => {
    const mode = workMode?.[0]?.trim().toLowerCase() || 'on-site';

    const modes: Record<string, { className: string; label: string }> = {
      remote: {
        className: 'badge-success',
        label: 'Remote',
      },
      'on-site': {
        className: 'badge-warning',
        label: 'On-site',
      },
      onsite: {
        className: 'badge-warning',
        label: 'On-site',
      },
      hybrid: {
        className: 'badge-info',
        label: 'Hybrid',
      },
    };

    return (
      modes[mode] || {
        className: 'badge',
        label: workMode?.[0] || 'On-site',
      }
    );
  };

  const formatSalary = (packageDetails: Job['packageDetails']) => {
    const totalCTC = Number(packageDetails?.totalCTC || 0);
    const currency = packageDetails?.currency || 'INR';

    if (!totalCTC) return 'Salary not disclosed';

    if (totalCTC >= 10_000_000) {
      return `${currency} ${(totalCTC / 10_000_000).toFixed(1)} Cr`;
    }

    if (totalCTC >= 100_000) {
      return `${currency} ${(totalCTC / 100_000).toFixed(1)} L`;
    }

    return `${currency} ${totalCTC.toLocaleString('en-IN')}`;
  };

  const formatDate = (date?: string) => {
    if (!date) return 'Recently';

    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) return 'Recently';

    return parsed.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const getCompanyInitials = (name?: string) => {
    const normalized = name?.trim();

    if (!normalized) return 'CO';

    const words = normalized.split(/\s+/).filter(Boolean);

    if (words.length === 1) {
      return words[0].slice(0, 2).toUpperCase();
    }

    return `${words[0][0]}${words[1][0]}`.toUpperCase();
  };

  const renderCompanyLogo = (job: Job, size: 'large' | 'small' = 'small') => {
    const large = size === 'large';

    return (
      <div
        className={[
          'flex shrink-0 items-center justify-center rounded-[var(--radius-lg)]',
          'border border-theme bg-[var(--primary-soft)] text-primary',
          'font-bold tracking-tight shadow-[var(--shadow-xs)]',
          large ? 'h-12 w-12 text-sm' : 'h-9 w-9 text-[10px]',
        ].join(' ')}
        aria-hidden="true"
      >
        {getCompanyInitials(job.companyName || 'Company')}
      </div>
    );
  };

  const renderSliderJob = () => {
    if (!jobs.length) return null;

    const activeJob = jobs[currentIndex] || jobs[0];
    const { job, applicationCount } = activeJob;

    const jobTypeBadge = getJobTypeBadge(job.jobType);
    const workModeBadge = getWorkModeBadge(job.workMode);
    const applications = applicationCount || job.applicationCount || 0;
    const visibleSkills = job.skills?.slice(0, MAX_VISIBLE_SKILLS) || [];
    const extraSkills = Math.max((job.skills?.length || 0) - visibleSkills.length, 0);

    return (
      <article
        className={[
          'group relative overflow-hidden rounded-[var(--radius-xl)]',
          'border border-theme bg-[var(--card)]',
          'shadow-[var(--shadow-sm)]',
          'transition-[transform,box-shadow,border-color,background-color] duration-200',
          'hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-md)]',
        ].join(' ')}
        onClick={() => handleJobClick(job._id)}
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handleJobClick(job._id);
          }
        }}
      >
        <div className="p-4 sm:p-5">
          <div className="flex items-start gap-3">
            {renderCompanyLogo(job, 'large')}

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="mb-0.5 text-[10px] font-medium uppercase tracking-[0.06em] text-muted">
                    Trending
                  </p>

                  <h3 className="truncate text-sm font-semibold leading-tight text-primary">
                    {job.jobTitle?.[0] || 'Position Available'}
                  </h3>

                  <p className="mt-0.5 flex items-center gap-1.5 truncate text-xs text-secondary">
                    <Building2 className="h-3 w-3 shrink-0 text-muted" />
                    {job.companyName || 'Company'}
                  </p>
                </div>

                <div className="flex shrink-0 flex-wrap justify-end gap-1.5">
                  <span className={`badge ${jobTypeBadge.className} text-[10px]`}>
                    {jobTypeBadge.label}
                  </span>
                  <span className={`badge ${workModeBadge.className} text-[10px]`}>
                    {workModeBadge.label}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            <div className="rounded-[var(--radius-md)] border border-theme bg-[var(--card-soft)] px-2.5 py-2">
              <p className="text-[9px] font-medium uppercase tracking-wide text-muted">Location</p>
              <p className="mt-0.5 flex min-w-0 items-center gap-1 truncate text-[11px] font-medium text-primary">
                <MapPin className="h-3 w-3 shrink-0 text-muted" />
                {job.workLocation?.[0] || job.location?.[0] || 'Not specified'}
              </p>
            </div>

            <div className="rounded-[var(--radius-md)] border border-theme bg-[var(--card-soft)] px-2.5 py-2">
              <p className="text-[9px] font-medium uppercase tracking-wide text-muted">Package</p>
              <p className="mt-0.5 truncate text-[11px] font-semibold text-primary">
                {formatSalary(job.packageDetails)}
              </p>
            </div>

            <div className="rounded-[var(--radius-md)] border border-theme bg-[var(--card-soft)] px-2.5 py-2">
              <p className="text-[9px] font-medium uppercase tracking-wide text-muted">Posted</p>
              <p className="mt-0.5 flex items-center gap-1 text-[11px] font-medium text-primary">
                <Clock3 className="h-3 w-3 text-muted" />
                {formatDate(job.createdAt)}
              </p>
            </div>

            <div className="rounded-[var(--radius-md)] border border-theme bg-[var(--card-soft)] px-2.5 py-2">
              <p className="text-[9px] font-medium uppercase tracking-wide text-muted">Applications</p>
              <p className="mt-0.5 flex items-center gap-1 text-[11px] font-semibold text-primary">
                <Users className="h-3 w-3 text-muted" />
                {applications.toLocaleString('en-IN')}
              </p>
            </div>
          </div>

          {visibleSkills.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-1">
              {visibleSkills.map((skill, index) => (
                <span key={`${skill}-${index}`} className="badge text-[10px]">
                  {skill}
                </span>
              ))}

              {extraSkills > 0 && (
                <span className="text-[10px] font-medium text-muted">
                  +{extraSkills} more
                </span>
              )}
            </div>
          )}

          <div className="mt-3 flex items-center justify-between border-t border-theme pt-3">
            <div className="flex items-center gap-3 text-[10px] text-muted">
              <span className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {(job.views || 0).toLocaleString('en-IN')} views
              </span>

              {job.jobRoles?.[0] && (
                <span className="hidden max-w-[200px] truncate sm:inline">
                  {job.jobRoles[0]}
                </span>
              )}
            </div>

            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary transition-transform duration-200 group-hover:translate-x-0.5">
              View details
              <ArrowRight className="h-3 w-3" />
            </span>
          </div>
        </div>

        <div className="h-0.5 w-full bg-[var(--background-soft)]" aria-hidden="true">
          <div
            className="h-full rounded-full bg-[var(--primary)]"
            style={{
              width: isAutoPlaying ? '100%' : '0%',
              transition: isAutoPlaying
                ? `width ${AUTO_PLAY_MS}ms linear`
                : 'width 150ms ease',
            }}
          />
        </div>
      </article>
    );
  };

  const renderJobList = () => {
    const visibleJobs = jobs.slice(0, MAX_VISIBLE_JOBS);

    return (
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {visibleJobs.map(({ job, applicationCount }) => {
          const isHovered = hoveredJob === job._id;
          const jobTypeBadge = getJobTypeBadge(job.jobType);
          const applications = applicationCount || job.applicationCount || 0;

          return (
            <article
              key={job._id}
              onClick={() => handleJobClick(job._id)}
              onMouseEnter={() => setHoveredJob(job._id)}
              onMouseLeave={() => setHoveredJob(null)}
              className={[
                'group cursor-pointer rounded-[var(--radius-lg)] border border-theme',
                'bg-[var(--card)] p-3.5 shadow-[var(--shadow-xs)]',
                'transition-[transform,box-shadow,border-color,background-color] duration-200',
                'hover:-translate-y-0.5 hover:border-[var(--border-strong)]',
                'hover:bg-[var(--card-hover)] hover:shadow-[var(--shadow-sm)]',
              ].join(' ')}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  handleJobClick(job._id);
                }
              }}
            >
              <div className="flex items-start gap-3">
                {renderCompanyLogo(job)}

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h4 className="truncate text-xs font-semibold text-primary">
                        {job.jobTitle?.[0] || 'Position'}
                      </h4>

                      <p className="mt-0.5 truncate text-[10px] text-secondary">
                        {job.companyName || 'Company'}
                      </p>
                    </div>

                    <span className={`badge ${jobTypeBadge.className} shrink-0 text-[9px]`}>
                      {jobTypeBadge.label}
                    </span>
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[10px] text-muted">
                    <span className="flex items-center gap-0.5">
                      <MapPin className="h-2.5 w-2.5" />
                      {job.workLocation?.[0] || job.location?.[0] || 'Location not specified'}
                    </span>

                    <span className="font-semibold text-primary">
                      {formatSalary(job.packageDetails)}
                    </span>
                  </div>

                  {job.skills?.length > 0 && (
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {job.skills.slice(0, 2).map((skill, index) => (
                        <span key={`${skill}-${index}`} className="badge text-[9px]">
                          {skill}
                        </span>
                      ))}

                      {job.skills.length > 2 && (
                        <span className="self-center text-[9px] font-medium text-muted">
                          +{job.skills.length - 2}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="mt-2 flex items-center justify-between border-t border-theme pt-2">
                    <div className="flex items-center gap-2 text-[9px] text-muted">
                      <span className="flex items-center gap-0.5">
                        <Users className="h-2.5 w-2.5" />
                        {applications.toLocaleString('en-IN')}
                      </span>

                      <span className="flex items-center gap-0.5">
                        <Eye className="h-2.5 w-2.5" />
                        {(job.views || 0).toLocaleString('en-IN')}
                      </span>
                    </div>

                    <span
                      className={[
                        'inline-flex items-center gap-0.5 text-[9px] font-semibold text-primary',
                        'transition-transform duration-200',
                        isHovered ? 'translate-x-0.5' : '',
                      ].join(' ')}
                    >
                      View
                      <ChevronRight
                        className={[
                          'h-2.5 w-2.5 transition-transform duration-200',
                          isHovered ? 'translate-x-0.5' : '',
                        ].join(' ')}
                      />
                    </span>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    );
  };

  if (loading) {
    return (
      <section className="space-y-4" aria-label="Loading trending jobs">
        <div className="flex items-center justify-between">
          <div className="h-4 w-28 rounded-md shimmer" />
          <div className="h-3 w-8 rounded-full shimmer" />
        </div>

        <div className="card overflow-hidden p-4">
          <div className="flex items-start gap-3">
            <div className="h-12 w-12 shrink-0 rounded-[var(--radius-lg)] shimmer" />

            <div className="flex-1 space-y-1.5">
              <div className="h-2 w-20 rounded shimmer" />
              <div className="h-4 w-2/3 rounded shimmer" />
              <div className="h-2 w-1/3 rounded shimmer" />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="h-12 rounded-[var(--radius-md)] shimmer" />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="card h-28 p-3.5">
              <div className="flex gap-3">
                <div className="h-9 w-9 shrink-0 rounded-[var(--radius-lg)] shimmer" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-2 w-2/3 rounded shimmer" />
                  <div className="h-2 w-1/3 rounded shimmer" />
                  <div className="h-2 w-1/2 rounded shimmer" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="card p-6 text-center shadow-[var(--shadow-sm)]">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[var(--danger-soft)] text-danger">
          <Briefcase className="h-5 w-5" />
        </div>

        <h3 className="mt-2.5 text-sm font-semibold text-primary">
          Trending jobs unavailable
        </h3>

        <p className="mt-1 text-xs text-muted">{error}</p>

        <button type="button" onClick={fetchTrendingJobs} className="btn-primary mt-3.5">
          Try again
        </button>
      </section>
    );
  }

  if (jobs.length === 0) {
    return (
      <section className="card p-6 text-center shadow-[var(--shadow-sm)]">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[var(--primary-soft)] text-primary">
          <Briefcase className="h-5 w-5" />
        </div>

        <h3 className="mt-2.5 text-sm font-semibold text-primary">
          No trending jobs yet
        </h3>

        <p className="mt-1 text-xs text-muted">
          Check back later for new opportunities.
        </p>
      </section>
    );
  }

  const activeIndex = Math.min(currentIndex, jobs.length - 1);

  return (
    <section className="space-y-5">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--primary-soft)] text-primary">
            <TrendingUp className="h-3.5 w-3.5" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-primary">
                Trending Jobs
              </h2>

              <span className="badge badge-primary text-[9px]">{jobs.length}</span>
            </div>

            <p className="mt-0.5 text-[10px] text-muted">
              Popular opportunities candidates are exploring
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setIsAutoPlaying((value) => !value)}
            className="btn-ghost !min-h-7 !px-1.5 text-[10px]"
            aria-label={isAutoPlaying ? 'Pause trending jobs' : 'Play trending jobs'}
            title={isAutoPlaying ? 'Pause' : 'Play'}
          >
            {isAutoPlaying ? (
              <Pause className="h-3 w-3" />
            ) : (
              <Play className="h-3 w-3" />
            )}
            <span className="hidden sm:inline text-[10px]">{isAutoPlaying ? 'Pause' : 'Play'}</span>
          </button>

          {jobs.length > 1 && (
            <div className="flex items-center gap-1 rounded-full border border-theme bg-[var(--card-soft)] px-2 py-1.5">
              {jobs.slice(0, Math.min(jobs.length, 5)).map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => {
                    setCurrentIndex(index);
                    setIsAutoPlaying(false);
                  }}
                  className={[
                    'h-1 rounded-full transition-all duration-200',
                    index === activeIndex
                      ? 'w-4 bg-[var(--primary)]'
                      : 'w-1 bg-[var(--border-strong)] hover:bg-[var(--primary)]',
                  ].join(' ')}
                  aria-label={`Show trending job ${index + 1}`}
                  aria-current={index === activeIndex ? 'true' : undefined}
                />
              ))}
            </div>
          )}
        </div>
      </header>

      <div>{renderSliderJob()}</div>

      {jobs.length > 1 && (
        <section>
          <div className="mb-2.5 flex items-end justify-between gap-3">
            <div>
              <h3 className="text-xs font-semibold text-primary">
                More Opportunities
              </h3>
              <p className="mt-0.5 text-[10px] text-muted">
                Explore other roles gaining attention
              </p>
            </div>

            <span className="text-[10px] font-medium text-muted">
              {Math.min(jobs.length, MAX_VISIBLE_JOBS)} of {jobs.length}
            </span>
          </div>

          {renderJobList()}
        </section>
      )}
    </section>
  );
};

export default TrendingJobs;