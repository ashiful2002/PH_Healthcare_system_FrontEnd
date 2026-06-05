export default function Loading() {
    return (
        <div style={styles.container}>
            <style>{css}</style>
            <div style={styles.inner}>
                <div className="loader-bars">
                    {[0, 1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="bar" style={{ animationDelay: `${i * 0.12}s` }} />
                    ))}
                </div>
                <p style={styles.label}>Loading PH Healthcare App...</p>
            </div>
        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
    container: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "#09090b",
    },
    inner: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "20px",
    },
    label: {
        fontFamily: "'DM Mono', 'Courier New', monospace",
        fontSize: "11px",
        fontWeight: 500,
        letterSpacing: "0.25em",
        textTransform: "uppercase" as const,
        color: "#52525b",
        margin: 0,
    },
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&display=swap');

  .loader-bars {
    display: flex;
    align-items: flex-end;
    gap: 5px;
    height: 36px;
  }

  .bar {
    width: 4px;
    height: 12px;
    background: #e4e4e7;
    border-radius: 2px;
    animation: pulse-bar 1s ease-in-out infinite;
  }

  @keyframes pulse-bar {
    0%, 100% {
      height: 12px;
      opacity: 0.2;
    }
    50% {
      height: 36px;
      opacity: 1;
    }
  }
`;