import { LayoutGrid } from "lucide-react";
import { motion } from "motion/react";

type Page =
  | "dashboard"
  | "chat"
  | "memories"
  | "settings"
  | "more"
  | "analytics"
  | "missions"
  | "timecapsule"
  | "anniversaries"
  | "quiz";

interface BottomNavProps {
  activePage: Page;
  onNavigate: (page: Page) => void;
}

const navItems: {
  page: Page;
  icon: React.ReactNode;
  label: string;
  ocid: string;
}[] = [
  {
    page: "dashboard",
    icon: <span className="text-xl">🏠</span>,
    label: "Home",
    ocid: "nav.home_link",
  },
  {
    page: "chat",
    icon: <span className="text-xl">💬</span>,
    label: "Chat",
    ocid: "nav.chat_link",
  },
  {
    page: "memories",
    icon: <span className="text-xl">📸</span>,
    label: "Memories",
    ocid: "nav.memory_link",
  },
  {
    page: "settings",
    icon: <span className="text-xl">⚙️</span>,
    label: "Settings",
    ocid: "nav.settings_link",
  },
  {
    page: "more",
    icon: <LayoutGrid className="w-5 h-5" />,
    label: "More",
    ocid: "nav.more_link",
  },
];

const TOP_LEVEL_PAGES: Page[] = [
  "dashboard",
  "chat",
  "memories",
  "settings",
  "more",
];

export default function BottomNav({ activePage, onNavigate }: BottomNavProps) {
  const effectivePage = TOP_LEVEL_PAGES.includes(activePage)
    ? activePage
    : "more";

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      <div className="mx-auto max-w-[430px]">
        <div
          className="flex items-center justify-around px-2 pb-safe border-t"
          style={{
            background: "rgba(0,0,0,0.35)",
            backdropFilter: "blur(16px)",
            borderColor: "rgba(255,255,255,0.15)",
          }}
        >
          {navItems.map((item) => {
            const isActive = effectivePage === item.page;
            return (
              <button
                type="button"
                key={item.page}
                data-ocid={item.ocid}
                onClick={() => onNavigate(item.page)}
                className="relative flex flex-col items-center gap-0.5 py-3 px-3 rounded-xl transition-colors"
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-xl"
                    style={{ background: "rgba(255,255,255,0.15)" }}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                  />
                )}
                <span
                  className="relative z-10 transition-colors"
                  style={{ opacity: isActive ? 1 : 0.55 }}
                >
                  {item.icon}
                </span>
                <span
                  className="text-[10px] font-medium relative z-10 transition-colors"
                  style={{
                    color: isActive
                      ? "rgba(255,255,255,0.97)"
                      : "rgba(255,255,255,0.55)",
                  }}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
