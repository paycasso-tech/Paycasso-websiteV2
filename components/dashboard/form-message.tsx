export type Message =
  | { success?: string }
  | { error?: string }
  | { message?: string };

export function FormMessage({ message }: { message: Message }) {
  // Safely check for properties without using 'in' operator
  const hasSuccess = message && typeof message === 'object' && Object.prototype.hasOwnProperty.call(message, 'success') && (message as any).success;
  const hasError = message && typeof message === 'object' && Object.prototype.hasOwnProperty.call(message, 'error') && (message as any).error;
  const hasMessage = message && typeof message === 'object' && Object.prototype.hasOwnProperty.call(message, 'message') && (message as any).message;

  return (
    <div className="flex flex-col gap-2 w-full max-w-md text-sm">
      {hasSuccess && (
        <div className="text-foreground border-l-2 border-foreground px-4">
          {(message as any).success}
        </div>
      )}
      {hasError && (
        <div className="text-destructive-foreground border-l-2 border-destructive-foreground px-4">
          {(message as any).error}
        </div>
      )}
      {hasMessage && (
        <div className="text-foreground border-l-2 px-4">{(message as any).message}</div>
      )}
    </div>
  );
}
