import crypto from 'node:crypto';

/**
 * Hash a plain text password using scrypt
 * @param {string} password
 * @returns {string} "salt:hash"
 */
export function hashPassword(password) {
	const salt = crypto.randomBytes(16).toString('hex');
	const hash = crypto.scryptSync(password, salt, 64).toString('hex');
	return `${salt}:${hash}`;
}

/**
 * Verify a plain text password against a stored "salt:hash" string
 * @param {string} password
 * @param {string} storedHash
 * @returns {boolean}
 */
export function verifyPassword(password, storedHash) {
	try {
		if (!storedHash || !storedHash.includes(':')) return false;
		const [salt, key] = storedHash.split(':');
		if (!salt || !key) return false;
		const keyBuffer = Buffer.from(key, 'hex');
		const derivedKey = crypto.scryptSync(password, salt, 64);
		return crypto.timingSafeEqual(keyBuffer, derivedKey);
	} catch {
		return false;
	}
}
