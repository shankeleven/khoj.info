(function () {
  const { useState, useRef, useEffect } = React;

  /******************** Utils ************************/
  function scrollToRef(ref) {
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  }

  function copyToClipboard(text, callback) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(callback).catch(callback);
    } else {
      // Fallback: create temporary element
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand("copy");
        callback();
      } catch (_) {
        callback();
      }
      document.body.removeChild(textarea);
    }
  }

  /******************** Components ************************/
  function ThemeToggle({ theme, onToggle }) {
    return (
      React.createElement(
        "button",
        {
          className: "theme-toggle",
          onClick: onToggle,
          "aria-label": "Toggle theme",
        },
        theme === "light" ? "🌙" : "☀️"
      )
    );
  }

  function Navbar({ onNavClick, theme, onToggleTheme }) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const navItems = [
      { id: "home", label: "Home" },
      { id: "installation", label: "Installation" },
      { id: "documentation", label: "Documentation" },
    ];

    function handleNav(id) {
      onNavClick(id);
      setMobileOpen(false);
    }

    return (
      React.createElement("nav", { className: "navbar" },
        React.createElement("div", {
          className: "logo",
          onClick: () => handleNav("home"),
          style: { cursor: "pointer" }
        }, "Khoj"),
        React.createElement("ul", { className: "nav-links" },
          navItems.map((item) => (
            React.createElement("li", { key: item.id },
              React.createElement("a", {
                className: "nav-link",
                onClick: (e) => {
                  e.preventDefault();
                  handleNav(item.id);
                },
                href: `#${item.id}`,
                style: { cursor: "pointer" }
              }, item.label)
            )
          )),
        ),
        React.createElement("button", {
          className: "hamburger",
          onClick: () => setMobileOpen(!mobileOpen),
          "aria-label": "Toggle navigation menu",
        },
          React.createElement("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" },
            React.createElement("line", { x1: 3, y1: 12, x2: 21, y2: 12 }),
            React.createElement("line", { x1: 3, y1: 6, x2: 21, y2: 6 }),
            React.createElement("line", { x1: 3, y1: 18, x2: 21, y2: 18 }),
          )
        ),
        React.createElement(ThemeToggle, { theme, onToggle: onToggleTheme }),
        mobileOpen && React.createElement("div", { className: "mobile-menu" },
          navItems.map((item) => (
            React.createElement("a", {
              key: item.id,
              className: "nav-link",
              onClick: (e) => {
                e.preventDefault();
                handleNav(item.id);
              },
              href: `#${item.id}`,
              style: { cursor: "pointer" }
            }, item.label)
          ))
        )
      )
    );
  }

  function Hero({ onGetStarted }) {
    return (
      React.createElement("section", { className: "hero", id: "hero" },
        React.createElement("h1", null, "Search your files at the speed of thought"),
        React.createElement("p", null, "Khoj is a blazing fast, privacy-first local search engine for your files."),
        React.createElement("button", {
          className: "btn btn--light",
          onClick: onGetStarted
        }, "Get Started")
      )
    );
  }

  function Feature({ icon, title, text }) {
    return React.createElement("div", { className: "feature-card" },
      React.createElement("div", { className: "feature-icon", "aria-hidden": true }, icon),
      React.createElement("h4", { className: "feature-title" }, title),
      React.createElement("p", null, text)
    );
  }

  function Features() {
    const featureData = [
      {
        icon: "⚡️",
        title: "Blazing Fast",
        text: "Instantly search through gigabytes of data without delay.",
      },
      {
        icon: "🔒",
        title: "Privacy-first",
        text: "All indexing and search happen 100% locally on your device.",
      },
      {
        icon: "🖥️",
        title: "Cross-platform",
        text: "Works seamlessly across Linux, macOS, and Windows.",
      },
      {
        icon: "💻",
        title: "CLI & GUI",
        text: "Use the intuitive command line or upcoming desktop app.",
      },
    ];
    return (
      React.createElement("div", { className: "features-grid" },
        featureData.map((f, idx) => React.createElement(Feature, { key: idx, ...f }))
      )
    );
  }

  function Installation() {
    const [activeTab, setActiveTab] = useState("apt");
    const [copied, setCopied] = useState(false);

    // Define installation commands for each package manager
    const getCommand = (packageManager) => {
      switch(packageManager) {
        case "apt": return "sudo apt install khoj";
        case "dnf": return "sudo dnf install khoj";
        case "brew": return "brew install khoj";
        case "cargo": return "cargo install khoj";
        default: return "sudo apt install khoj";
      }
    };

    const tabs = ["apt", "dnf", "brew", "cargo"];
    const currentCommand = getCommand(activeTab);

    function handleCopy() {
      copyToClipboard(currentCommand, () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }

    function handleTabClick(tabId) {
      setActiveTab(tabId);
      setCopied(false);
    }

    return (
      React.createElement("section", { className: "section", id: "installation" },
        React.createElement("h2", null, "Installation"),
        React.createElement("div", { className: "tabs" },
          tabs.map((tab) => (
            React.createElement("button", {
              key: tab,
              className: `tab-btn ${activeTab === tab ? "active" : ""}`,
              onClick: () => handleTabClick(tab),
            }, tab)
          ))
        ),
        React.createElement("div", { className: "code-block" },
          React.createElement("code", null, currentCommand),
          React.createElement("button", {
            className: "copy-btn",
            onClick: handleCopy,
            "aria-label": "Copy install command",
          }, copied ? "✔" : "📋")
        )
      )
    );
  }

  function Documentation() {
    return (
      React.createElement("section", { className: "section", id: "documentation" },
        React.createElement("h2", null, "Documentation"),
        React.createElement("p", null, "Learn how to harness Khoj's powerful CLI to index and search your files in detail."),
        React.createElement("pre", null,
          React.createElement("code", null, "$ khoj search --query 'function parse' --path ./src")
        ),
        React.createElement("a", {
          href: "https://docs.khoj.dev",
          target: "_blank",
          rel: "noopener noreferrer",
          className: "btn btn--primary docs-button",
        }, "Read the Docs")
      )
    );
  }

  function HomeSection({ onGetStarted }) {
    return (
      React.createElement("div", { id: "home" },
        React.createElement(Hero, { onGetStarted }),
        React.createElement("section", { className: "section" },
          React.createElement(Features, null)
        )
      )
    );
  }

  /******************** Main App ************************/
  function App() {
    // refs to sections
    const homeRef = useRef(null);
    const installRef = useRef(null);
    const docsRef = useRef(null);

    // Theme state
    const [theme, setTheme] = useState('light');

    // Apply theme changes immediately
    useEffect(() => {
      document.documentElement.setAttribute('data-color-scheme', theme);
    }, [theme]);

    const sectionRefs = {
      home: homeRef,
      installation: installRef,
      documentation: docsRef,
    };

    function handleNav(id) {
      const targetRef = sectionRefs[id];
      if (targetRef && targetRef.current) {
        targetRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }

    function toggleTheme() {
      setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    }

    return (
      React.createElement(React.Fragment, null,
        React.createElement(Navbar, {
          onNavClick: handleNav,
          onToggleTheme: toggleTheme,
          theme,
        }),
        React.createElement("main", null,
          React.createElement("div", { ref: homeRef },
            React.createElement(HomeSection, { onGetStarted: () => handleNav('installation') })
          ),
          React.createElement("div", { ref: installRef },
            React.createElement(Installation, null)
          ),
          React.createElement("div", { ref: docsRef },
            React.createElement(Documentation, null)
          )
        )
      )
    );
  }

  ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(App));
})();
