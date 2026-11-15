/**
 * Zero-dependency physics-based confetti celebration effect
 */
export function triggerConfetti(options = {}) {
	if (typeof window === 'undefined') return;

	const count = options.count ?? 70;
	const origin = options.origin ?? 'center';
	const colors = options.colors ?? [
		'#f59e0b', // amber
		'#fbbf24', // yellow
		'#10b981', // emerald
		'#34d399', // mint
		'#06b6d4', // cyan
		'#8b5cf6', // purple
		'#ec4899', // pink
		'#f43f5e' // rose
	];

	const canvas = document.createElement('canvas');
	canvas.style.position = 'fixed';
	canvas.style.top = '0';
	canvas.style.left = '0';
	canvas.style.width = '100vw';
	canvas.style.height = '100vh';
	canvas.style.pointerEvents = 'none';
	canvas.style.zIndex = '999999';
	document.body.appendChild(canvas);

	const ctx = canvas.getContext('2d');
	if (!ctx) {
		canvas.remove();
		return;
	}

	const dpr = window.devicePixelRatio || 1;
	const width = window.innerWidth;
	const height = window.innerHeight;
	canvas.width = width * dpr;
	canvas.height = height * dpr;
	ctx.scale(dpr, dpr);

	let startX = width * 0.5;
	let startY = height * 0.65;
	let baseVx = 0;

	if (origin === 'left') {
		startX = width * 0.1;
		startY = height * 0.75;
		baseVx = 10;
	} else if (origin === 'right') {
		startX = width * 0.9;
		startY = height * 0.75;
		baseVx = -10;
	}

	const particles = [];

	for (let i = 0; i < count; i++) {
		const spreadX = (Math.random() - 0.5) * 10;
		const vx =
			origin === 'center'
				? (Math.random() - 0.5) * 18
				: baseVx + spreadX + Math.random() * 6 * (origin === 'left' ? 1 : -1);

		const vy = -(Math.random() * 15 + 9);

		particles.push({
			x: startX,
			y: startY,
			w: Math.random() * 8 + 6,
			h: Math.random() * 6 + 4,
			color: colors[Math.floor(Math.random() * colors.length)],
			vx,
			vy,
			gravity: 0.42,
			drag: 0.98,
			rotation: Math.random() * 360,
			rotationSpeed: (Math.random() - 0.5) * 14,
			opacity: 1,
			isCircle: Math.random() > 0.65
		});
	}

	let animationId;
	const startTime = performance.now();
	const duration = 3200; // 3.2 seconds

	function render(time) {
		const elapsed = time - startTime;
		const progress = Math.min(elapsed / duration, 1);

		ctx.clearRect(0, 0, width, height);

		let activeParticles = 0;

		for (const p of particles) {
			p.vx *= p.drag;
			p.vy = p.vy * p.drag + p.gravity;
			p.x += p.vx;
			p.y += p.vy;
			p.rotation += p.rotationSpeed;

			if (progress > 0.55) {
				p.opacity = Math.max(0, 1 - (progress - 0.55) / 0.45);
			}

			if (p.opacity > 0 && p.y < height + 40) {
				activeParticles++;

				ctx.save();
				ctx.translate(p.x, p.y);
				ctx.rotate((p.rotation * Math.PI) / 180);
				ctx.globalAlpha = p.opacity;
				ctx.fillStyle = p.color;

				if (p.isCircle) {
					ctx.beginPath();
					ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
					ctx.fill();
				} else {
					ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
				}

				ctx.restore();
			}
		}

		if (activeParticles > 0 && progress < 1) {
			animationId = requestAnimationFrame(render);
		} else {
			cancelAnimationFrame(animationId);
			if (canvas.parentNode) {
				canvas.parentNode.removeChild(canvas);
			}
		}
	}

	animationId = requestAnimationFrame(render);
}

/**
 * Fires a celebratory multi-stage confetti volley
 */
export function fireQuizCelebration() {
	triggerConfetti({ count: 70, origin: 'left' });
	setTimeout(() => {
		triggerConfetti({ count: 70, origin: 'right' });
	}, 150);
	setTimeout(() => {
		triggerConfetti({ count: 90, origin: 'center' });
	}, 350);
}
