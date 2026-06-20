"use client";

export function ClearRSVPButton({
  action,
  disabled
}: {
  action: () => Promise<void>;
  disabled: boolean;
}) {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!window.confirm("Clear all RSVP submissions and movie votes? This cannot be undone.")) {
          event.preventDefault();
        }
      }}
    >
      <button
        disabled={disabled}
        className="button-pop rounded-full bg-lakayRed px-5 py-3 font-display text-lg font-black uppercase text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        Clear RSVP Data
      </button>
    </form>
  );
}
