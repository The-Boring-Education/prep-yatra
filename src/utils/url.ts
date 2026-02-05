/**
 * Ensures a URL has a protocol (defaults to https:// if missing)
 * @param url The URL string to normalize
 * @returns The normalized URL string
 */
export const withProtocol = (url: string | undefined): string => {
    if (!url || url.trim() === "") {
        return "";
    }
    
    const trimmedUrl = url.trim();
    if (!trimmedUrl.startsWith("http://") && !trimmedUrl.startsWith("https://")) {
        return `https://${trimmedUrl}`;
    }
    return trimmedUrl;
};
