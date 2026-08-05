export default function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Referd",
    url: "https://referd.in",
    logo: "https://referd.in/logo.png",
    description:
      "Referd is India's alumni-powered referral hiring network connecting candidates with trusted employee referrals.",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema),
      }}
    />
  );
}