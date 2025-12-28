const TypingIndicator = () => {
  return (
    <div className="flex items-center gap-1.5 py-2">
      <span 
        className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-bounce"
        style={{ animationDelay: '0ms', animationDuration: '800ms' }}
      />
      <span 
        className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-bounce"
        style={{ animationDelay: '200ms', animationDuration: '800ms' }}
      />
      <span 
        className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-bounce"
        style={{ animationDelay: '400ms', animationDuration: '800ms' }}
      />
    </div>
  );
};

export { TypingIndicator };
