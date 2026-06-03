export const DEFAULT_CATEGORY_COLOR = "#00ff41";

export const parseWeight = (value: string) => {
    const next = Number.parseInt(value, 10);

    if (Number.isNaN(next)) {
        return 1;
    }

    return Math.min(5, Math.max(1, next));
};

export const parseColor = (value: string) => {
    const raw = value.trim().replace(/^#+/, "").slice(0, 6);
    const normalized = `#${raw}`;

    if (!/^#[0-9a-fA-F]{6}$/.test(normalized)) {
        return null;
    }

    return normalized.toLowerCase();
};
