import Image from "next/image";

type GoogleLoginButtonProps = {
  onClick?: () => void;
};

export default function GoogleLoginButton({
  onClick,
}: GoogleLoginButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-12 w-full hover:cursor-pointer items-center justify-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--card)]/70 px-5 text-[14px] font-medium text-white transition hover:border-white/15 hover:bg-[var(--card-hover)]  "
    >
      <Image
        src="https://www.svgrepo.com/show/475656/google-color.svg"
        alt="Google"
        width={18}
        height={18}
      />

      Continue with Google
    </button>
  );
}