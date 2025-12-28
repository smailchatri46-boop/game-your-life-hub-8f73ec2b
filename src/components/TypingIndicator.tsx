const TypingIndicator = () => {
  return (
    <div className="flex items-center gap-1 py-1">
      <span 
        className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce"
        style={{ animationDelay: '0ms', animationDuration: '600ms' }}
      />
      <span 
        className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce"
        style={{ animationDelay: '150ms', animationDuration: '600ms' }}
      />
      <span 
        className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce"
        style={{ animationDelay: '300ms', animationDuration: '600ms' }}
      />
    </div>
  );
};

export { TypingIndicator };
