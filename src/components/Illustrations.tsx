import { motion } from 'motion/react';

export function PiggyBankHeroIllustration() {
  return (
    <motion.div
      initial={{ scale: 0.92, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex items-center justify-center"
    >
      <svg
        width="96"
        height="88"
        viewBox="0 0 120 110"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Ống heo Ví Tỉnh Tảo"
        className="drop-shadow-[0_10px_22px_rgba(34,15,82,0.28)]"
      >
        {/* Falling Coin */}
        <motion.g
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <circle cx="62" cy="18" r="10" fill="#FDE047" stroke="#F59E0B" strokeWidth="2.5" />
          <text
            x="62"
            y="22"
            textAnchor="middle"
            fill="#B45309"
            fontSize="11"
            fontWeight="800"
            fontFamily="sans-serif"
          >
            ₫
          </text>
        </motion.g>

        {/* Piggy Back Ear */}
        <path
          d="M36 42C31 30 39 23 48 31L49 41L36 42Z"
          fill="#E9D5FF"
          stroke="#FFFFFF"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Legs */}
        <rect x="37" y="81" width="12" height="16" rx="6" fill="#EDE9FE" stroke="#FFFFFF" strokeWidth="2" />
        <rect x="70" y="81" width="12" height="16" rx="6" fill="#EDE9FE" stroke="#FFFFFF" strokeWidth="2" />

        {/* Piggy Body */}
        <ellipse cx="60" cy="63" rx="35" ry="27" fill="#FFFFFF" />
        <ellipse cx="60" cy="63" rx="35" ry="27" fill="url(#piggyGrad)" fillOpacity="0.35" />

        {/* Tail */}
        <path
          d="M25 60C18 59 17 51 23 50C26 50 26 54 22 55"
          stroke="#FFFFFF"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Snout */}
        <ellipse cx="94" cy="64" rx="9" ry="11" fill="#F3E8FF" stroke="#FFFFFF" strokeWidth="2.5" />
        <circle cx="92" cy="61" r="1.8" fill="#6A48C9" />
        <circle cx="96" cy="66" r="1.8" fill="#6A48C9" />

        {/* Front Ear */}
        <path
          d="M68 38C70 27 81 26 83 37L73 43L68 38Z"
          fill="#F5F3FF"
          stroke="#FFFFFF"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Coin Slot */}
        <rect x="51" y="38" width="22" height="4.5" rx="2.25" fill="#5433B5" />

        {/* Eye & Blush */}
        <circle cx="77" cy="55" r="3" fill="#321D6B" />
        <circle cx="78" cy="54" r="1" fill="#FFFFFF" />
        <ellipse cx="73" cy="64" rx="4.5" ry="2.5" fill="#F9A8D4" fillOpacity="0.65" />

        <defs>
          <linearGradient id="piggyGrad" x1="30" y1="36" x2="90" y2="90" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFFFFF" />
            <stop offset="1" stopColor="#DDD6FE" />
          </linearGradient>
        </defs>
      </svg>
    </motion.div>
  );
}

interface HourglassProps {
  progress: number; // 0 to 1 over the 5-second countdown
}

export function HourglassMotionIllustration({ progress }: HourglassProps) {
  const clamped = Math.max(0, Math.min(1, progress));
  const topScaleY = Math.max(0.06, 1 - clamped * 0.94);
  const bottomScaleY = Math.max(0.08, 0.1 + clamped * 0.9);

  return (
    <div className="relative flex items-center justify-center py-2">
      <motion.div
        animate={{ rotate: [0, -1.5, 1.5, 0] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
        className="relative"
      >
        <svg
          width="118"
          height="138"
          viewBox="0 0 120 140"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Đồng hồ cát đang đếm ngược"
        >
          {/* Decorative Motion Lines matching reference */}
          <motion.path
            d="M101 55L110 51"
            stroke="#5D3FD3"
            strokeWidth="3"
            strokeLinecap="round"
            animate={{ opacity: [0.35, 1, 0.35] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          />
          <motion.path
            d="M103 68L113 69"
            stroke="#5D3FD3"
            strokeWidth="3"
            strokeLinecap="round"
            animate={{ opacity: [1, 0.35, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          />

          {/* Glass Body Outline */}
          <path
            d="M31 20H89V34C89 51 67 62 67 70C67 78 89 89 89 106V120H31V106C31 89 53 78 53 70C53 62 31 51 31 34V20Z"
            fill="#F3EFFC"
            stroke="#8B6FE3"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />

          {/* Top Sand (draining) */}
          <clipPath id="topBulbClip">
            <path d="M35 28H85V34C85 48 64 59 60 66C56 59 35 48 35 34V28Z" />
          </clipPath>
          <g clipPath="url(#topBulbClip)">
            <motion.rect
              x="33"
              y="32"
              width="54"
              height="36"
              fill="#F3CF98"
              style={{
                originX: 0.5,
                originY: 1,
                scaleY: topScaleY,
              }}
            />
          </g>

          {/* Falling Sand Stream */}
          {clamped < 0.98 && (
            <g>
              <motion.line
                x1="60"
                y1="67"
                x2="60"
                y2="112"
                stroke="#EAC07D"
                strokeWidth="3"
                strokeDasharray="4 4"
                animate={{ strokeDashoffset: [0, -16] }}
                transition={{ duration: 0.45, repeat: Infinity, ease: 'linear' }}
              />
              <motion.circle
                cx="60"
                cy="75"
                r="1.8"
                fill="#E3AF5E"
                animate={{ y: [0, 32], opacity: [1, 0.4] }}
                transition={{ duration: 0.55, repeat: Infinity, ease: 'linear' }}
              />
            </g>
          )}

          {/* Bottom Sand Mound (filling) */}
          <clipPath id="bottomBulbClip">
            <path d="M35 117H85V106C85 92 64 81 60 74C56 81 35 92 35 106V117Z" />
          </clipPath>
          <g clipPath="url(#bottomBulbClip)">
            <motion.path
              d="M34 117C38 102 52 94 60 94C68 94 82 102 86 117H34Z"
              fill="#F3CF98"
              style={{
                originX: 0.5,
                originY: 1,
                scaleY: bottomScaleY,
              }}
            />
          </g>

          {/* Glass Highlights */}
          <path
            d="M38 30C38 41 44 49 51 55"
            stroke="#FFFFFF"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.85"
          />
          <path
            d="M38 111C38 100 44 92 51 86"
            stroke="#FFFFFF"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.85"
          />

          {/* Top & Bottom Purple Caps */}
          <rect x="22" y="12" width="76" height="11" rx="5.5" fill="#7D5CD6" stroke="#5D3FD3" strokeWidth="2.5" />
          <rect x="22" y="117" width="76" height="11" rx="5.5" fill="#7D5CD6" stroke="#5D3FD3" strokeWidth="2.5" />
        </svg>
      </motion.div>
    </div>
  );
}

export function RingingBellIllustration() {
  return (
    <div className="relative flex items-center justify-center py-2">
      {/* Left Acoustic Ring Lines */}
      <motion.svg
        width="124"
        height="96"
        viewBox="0 0 124 96"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Chuông báo đồng hồ đang rung"
      >
        {/* Sound Waves Left */}
        <motion.path
          d="M24 31C18 38 18 52 24 59"
          stroke="#7C5CE6"
          strokeWidth="3"
          strokeLinecap="round"
          animate={{ opacity: [0.2, 1, 0.2], x: [0, -3, 0] }}
          transition={{ duration: 0.7, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.path
          d="M15 24C7 34 7 56 15 66"
          stroke="#A78BFA"
          strokeWidth="2.5"
          strokeLinecap="round"
          animate={{ opacity: [0.1, 0.9, 0.1], x: [0, -4, 0] }}
          transition={{ duration: 0.7, repeat: Infinity, ease: 'easeInOut', delay: 0.12 }}
        />

        {/* Sound Waves Right */}
        <motion.path
          d="M100 31C106 38 106 52 100 59"
          stroke="#7C5CE6"
          strokeWidth="3"
          strokeLinecap="round"
          animate={{ opacity: [0.2, 1, 0.2], x: [0, 3, 0] }}
          transition={{ duration: 0.7, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.path
          d="M109 24C117 34 117 56 109 66"
          stroke="#A78BFA"
          strokeWidth="2.5"
          strokeLinecap="round"
          animate={{ opacity: [0.1, 0.9, 0.1], x: [0, 4, 0] }}
          transition={{ duration: 0.7, repeat: Infinity, ease: 'easeInOut', delay: 0.12 }}
        />

        {/* Vibrating Bell */}
        <motion.g
          style={{ originX: '62px', originY: '20px' }}
          animate={{ rotate: [0, -14, 14, -11, 11, -6, 6, 0] }}
          transition={{ duration: 1.1, repeat: Infinity, repeatDelay: 0.35, ease: 'easeInOut' }}
        >
          {/* Top Knob */}
          <circle cx="62" cy="18" r="5" fill="#5D3FD3" />
          {/* Bell Dome */}
          <path
            d="M40 46C40 32.7 49.8 22 62 22C74.2 22 84 32.7 84 46V60L91 69H33L40 60V46Z"
            fill="#6E48D8"
            stroke="#4C2FA3"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* Glossy Highlight */}
          <path
            d="M47 45C47 36 52 30 58 28"
            stroke="#DDD6FE"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* Bell Clapper */}
          <circle cx="62" cy="74" r="6.5" fill="#F59E0B" stroke="#D97706" strokeWidth="2" />
        </motion.g>
      </motion.svg>
    </div>
  );
}
