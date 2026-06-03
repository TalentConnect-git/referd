type LinkedinLoginButtonProps = {
  onClick?: () => void;
};

export default function LinkedinLoginButton({
  onClick,
}: LinkedinLoginButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex  hover:cursor-pointer h-12 w-full items-center justify-center gap-3 rounded-lg border border-[#0A66C2]/25 bg-[#0A66C2]/10 px-5 text-[14px] font-medium text-white transition hover:border-[#0A66C2]/40 hover:bg-[#0A66C2]/15"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 382 382"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        <path
          fill="#0077B7"
          d="M347.445,0H34.555C15.471,0,0,15.471,0,34.555v312.889
          C0,366.529,15.471,382,34.555,382h312.889
          C366.529,382,382,366.529,382,347.444V34.555
          C382,15.471,366.529,0,347.445,0z

          M118.207,329.844
          c0,5.554-4.502,10.056-10.056,10.056H65.345
          c-5.554,0-10.056-4.502-10.056-10.056V150.403
          c0-5.554,4.502-10.056,10.056-10.056h42.806
          c5.554,0,10.056,4.502,10.056,10.056V329.844z

          M86.748,123.432
          c-22.459,0-40.666-18.207-40.666-40.666
          S64.289,42.1,86.748,42.1
          s40.666,18.207,40.666,40.666
          S109.208,123.432,86.748,123.432z

          M341.91,330.654
          c0,5.106-4.14,9.246-9.246,9.246H286.73
          c-5.106,0-9.246-4.14-9.246-9.246v-84.168
          c0-12.556,3.683-55.021-32.813-55.021
          c-28.309,0-34.051,29.066-35.204,42.11v97.079
          c0,5.106-4.139,9.246-9.246,9.246h-44.426
          c-5.106,0-9.246-4.14-9.246-9.246V149.593
          c0-5.106,4.14-9.246,9.246-9.246h44.426
          c5.106,0,9.246,4.14,9.246,9.246v15.655
          c10.497-15.753,26.097-27.912,59.312-27.912
          c73.552,0,73.131,68.716,73.131,106.472V330.654z"
        />
      </svg>

      <span>Continue with LinkedIn</span>
    </button>
  );
}