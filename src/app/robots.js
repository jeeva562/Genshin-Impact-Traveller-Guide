export default function robots() {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/api/'],
        },
        sitemap: 'https://genshin-impact-traveller-guide.vercel.app/sitemap.xml',
    };
}
