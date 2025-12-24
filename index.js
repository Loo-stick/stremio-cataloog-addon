/**
 * Stremio Cataloog Addon
 *
 * @description Catalogue enrichi avec TMDB - Tendances, genres, thématiques et plus
 */

const { addonBuilder, serveHTTP } = require('stremio-addon-sdk');
const TMDBClient = require('./lib/tmdb');

// Configuration
const PORT = process.env.PORT || 7000;
const ADDON_URL = process.env.ADDON_URL || `http://localhost:${PORT}`;
const TMDB_API_KEY = process.env.TMDB_API_KEY;

if (!TMDB_API_KEY) {
    console.error('[Cataloog] ERREUR: TMDB_API_KEY non définie!');
    console.error('[Cataloog] Ajoutez votre clé API TMDB dans les variables d\'environnement');
    process.exit(1);
}

// Client TMDB
const tmdb = new TMDBClient(TMDB_API_KEY, 'fr-FR');

// ==================== DÉFINITION DES CATALOGUES ====================

const CATALOGS = {
    // Tendances
    'trending-movies-day': {
        name: '🔥 Tendances du jour',
        type: 'movie',
        fetch: (page) => tmdb.getTrendingMoviesDay(page)
    },
    'trending-movies-week': {
        name: '📈 Tendances semaine',
        type: 'movie',
        fetch: (page) => tmdb.getTrendingMoviesWeek(page)
    },
    'trending-series-day': {
        name: '🔥 Séries du jour',
        type: 'series',
        fetch: (page) => tmdb.getTrendingSeriesDay(page)
    },
    'trending-series-week': {
        name: '📈 Séries semaine',
        type: 'series',
        fetch: (page) => tmdb.getTrendingSeriesWeek(page)
    },

    // Plateformes
    'netflix-movies': {
        name: '🔴 Netflix(Films)',
        type: 'movie',
        fetch: (page) => tmdb.getMoviesByProvider(8, page)
    },
    'netflix-series': {
        name: '🔴 Netflix(Série)',
        type: 'series',
        fetch: (page) => tmdb.getSeriesByProvider(8, page)
    },
    'prime-movies': {
        name: '📦 Prime Video(Films)',
        type: 'movie',
        fetch: (page) => tmdb.getMoviesByProvider(119, page)
    },
    'prime-series': {
        name: '📦 Prime Video(Série)',
        type: 'series',
        fetch: (page) => tmdb.getSeriesByProvider(119, page)
    },
    'disney-movies': {
        name: '🏰 Disney+(Films)',
        type: 'movie',
        fetch: (page) => tmdb.getMoviesByProvider(337, page)
    },
    'disney-series': {
        name: '🏰 Disney+(Série)',
        type: 'series',
        fetch: (page) => tmdb.getSeriesByProvider(337, page)
    },
    'apple-movies': {
        name: '🍎 Apple TV+(Films)',
        type: 'movie',
        fetch: (page) => tmdb.getMoviesByProvider(350, page)
    },
    'apple-series': {
        name: '🍎 Apple TV+(Série)',
        type: 'series',
        fetch: (page) => tmdb.getSeriesByProvider(350, page)
    },
    'hbo-movies': {
        name: '💜 Max (HBO)(Films)',
        type: 'movie',
        fetch: (page) => tmdb.getMoviesByProvider(384, page)
    },
    'hbo-series': {
        name: '💜 Max (HBO)(Série)',
        type: 'series',
        fetch: (page) => tmdb.getSeriesByProvider(384, page)
    },
    'canal-movies': {
        name: '➕ Canal+(Films)',
        type: 'movie',
        fetch: (page) => tmdb.getMoviesByProvider(381, page)
    },
    'canal-series': {
        name: '➕ Canal+(Série)',
        type: 'series',
        fetch: (page) => tmdb.getSeriesByProvider(381, page)
    },
    'ocs-movies': {
        name: '🟠 OCS(Films)',
        type: 'movie',
        fetch: (page) => tmdb.getMoviesByProvider(56, page)
    },
    'ocs-series': {
        name: '🟠 OCS(Série)',
        type: 'series',
        fetch: (page) => tmdb.getSeriesByProvider(56, page)
    },
    'paramount-movies': {
        name: '⛰️ Paramount+(Films)',
        type: 'movie',
        fetch: (page) => tmdb.getMoviesByProvider(531, page)
    },
    'paramount-series': {
        name: '⛰️ Paramount+(Série)',
        type: 'series',
        fetch: (page) => tmdb.getSeriesByProvider(531, page)
    },
    'hulu-movies': {
        name: '💚 Hulu(Films)',
        type: 'movie',
        fetch: (page) => tmdb.getMoviesByProvider(15, page, 'US')
    },
    'hulu-series': {
        name: '💚 Hulu(Série)',
        type: 'series',
        fetch: (page) => tmdb.getSeriesByProvider(15, page, 'US')
    },
    'peacock-movies': {
        name: '🦚 Peacock(Films)',
        type: 'movie',
        fetch: (page) => tmdb.getMoviesByProvider(386, page, 'US')
    },
    'peacock-series': {
        name: '🦚 Peacock(Série)',
        type: 'series',
        fetch: (page) => tmdb.getSeriesByProvider(386, page, 'US')
    },

    // Top & Classements
    'top-rated-movies': {
        name: '🏆 Top Films',
        type: 'movie',
        fetch: (page) => tmdb.getTopRatedMovies(page)
    },
    'top-rated-series': {
        name: '🏆 Top Séries',
        type: 'series',
        fetch: (page) => tmdb.getTopRatedSeries(page)
    },

    // Sorties
    'now-playing': {
        name: '🎬 Au cinéma',
        type: 'movie',
        fetch: (page) => tmdb.getNowPlayingMovies(page)
    },
    'upcoming': {
        name: '📅 Prochainement',
        type: 'movie',
        fetch: (page) => tmdb.getUpcomingMovies(page)
    },

    // Genres Films
    'genre-action': {
        name: '💥 Action',
        type: 'movie',
        fetch: (page) => tmdb.getMoviesByGenre(28, page)
    },
    'genre-comedy': {
        name: '😂 Comédie',
        type: 'movie',
        fetch: (page) => tmdb.getMoviesByGenre(35, page)
    },
    'genre-horror': {
        name: '😱 Horreur',
        type: 'movie',
        fetch: (page) => tmdb.getMoviesByGenre(27, page)
    },
    'genre-scifi': {
        name: '🚀 Science-Fiction',
        type: 'movie',
        fetch: (page) => tmdb.getMoviesByGenre(878, page)
    },
    'genre-thriller': {
        name: '🔪 Thriller',
        type: 'movie',
        fetch: (page) => tmdb.getMoviesByGenre(53, page)
    },
    'genre-romance': {
        name: '💕 Romance',
        type: 'movie',
        fetch: (page) => tmdb.getMoviesByGenre(10749, page)
    },
    'genre-drama': {
        name: '📖 Drame',
        type: 'movie',
        fetch: (page) => tmdb.getMoviesByGenre(18, page)
    },
    'genre-animation': {
        name: '🎨 Animation',
        type: 'movie',
        fetch: (page) => tmdb.getMoviesByGenre(16, page)
    },
    'genre-documentary': {
        name: '📚 Documentaire',
        type: 'movie',
        fetch: (page) => tmdb.getMoviesByGenre(99, page)
    },

    // Genres Séries
    'genre-series-action': {
        name: '💥 Action',
        type: 'series',
        fetch: (page) => tmdb.getSeriesByGenre(10759, page) // Action & Adventure
    },
    'genre-series-comedy': {
        name: '😂 Comédie',
        type: 'series',
        fetch: (page) => tmdb.getSeriesByGenre(35, page)
    },
    'genre-series-horror': {
        name: '😱 Horreur',
        type: 'series',
        fetch: (page) => tmdb.getSeriesByGenre(9648, page) // Mystery (closest)
    },
    'genre-series-scifi': {
        name: '🚀 Science-Fiction',
        type: 'series',
        fetch: (page) => tmdb.getSeriesByGenre(10765, page) // Sci-Fi & Fantasy
    },
    'genre-series-thriller': {
        name: '🔪 Thriller',
        type: 'series',
        fetch: (page) => tmdb.getSeriesByGenre(80, page) // Crime
    },
    'genre-series-drama': {
        name: '📖 Drame',
        type: 'series',
        fetch: (page) => tmdb.getSeriesByGenre(18, page)
    },
    'genre-series-animation': {
        name: '🎨 Animation',
        type: 'series',
        fetch: (page) => tmdb.getSeriesByGenre(16, page)
    },
    'genre-series-documentary': {
        name: '📚 Documentaire',
        type: 'series',
        fetch: (page) => tmdb.getSeriesByGenre(99, page)
    },

    // Séries spéciales
    'miniseries': {
        name: '📺 Mini-séries',
        type: 'series',
        fetch: (page) => tmdb.getMiniSeries(page)
    },
    'kdramas': {
        name: '🇰🇷 K-Drama',
        type: 'series',
        fetch: (page) => tmdb.getKDramas(page)
    },
    'anime': {
        name: '🇯🇵 Anime',
        type: 'series',
        fetch: (page) => tmdb.getAnime(page)
    },
    'docuseries': {
        name: '📚 Docu-séries',
        type: 'series',
        fetch: (page) => tmdb.getDocuSeries(page)
    },

    // Par pays
    'country-fr': {
        name: '🇫🇷 Cinéma Français',
        type: 'movie',
        fetch: (page) => tmdb.getMoviesByCountry('FR', page)
    },
    'country-kr': {
        name: '🇰🇷 Cinéma Coréen',
        type: 'movie',
        fetch: (page) => tmdb.getMoviesByCountry('KR', page)
    },
    'country-jp': {
        name: '🇯🇵 Cinéma Japonais',
        type: 'movie',
        fetch: (page) => tmdb.getMoviesByCountry('JP', page)
    },

    // Thématiques
    'christmas': {
        name: '🎄 Noël',
        type: 'movie',
        fetch: (page) => tmdb.getChristmasMovies(page)
    },
    'feelgood': {
        name: '☀️ Feel Good',
        type: 'movie',
        fetch: (page) => tmdb.getFeelGoodMovies(page)
    },
    'cult': {
        name: '🍿 Films Cultes',
        type: 'movie',
        fetch: (page) => tmdb.getCultMovies(page)
    },
    'family': {
        name: '👨‍👩‍👧 Famille',
        type: 'movie',
        fetch: (page) => tmdb.getFamilyMovies(page)
    },

    // Récompenses
    'oscars': {
        name: '🏆 Oscars',
        type: 'movie',
        fetch: (page) => tmdb.getOscarWinners(page)
    }
};

// ==================== MANIFEST ====================

const manifest = {
    id: 'community.stremio.cataloog',
    version: '1.0.1',
    name: 'Cataloog',
    description: 'Catalogue enrichi TMDB - Tendances, genres, mini-séries, thématiques et plus',
    logo: 'https://www.themoviedb.org/assets/2/v4/logos/v2/blue_square_2-d537fb228cf3edd904ef09b136fe3fec72548ebc1fea3fbbd1ad9e36364db38b.svg',
    background: 'https://image.tmdb.org/t/p/original/56v2KjBlU4XaOv9rVYEQypROD7P.jpg',
    resources: ['catalog'],
    types: ['movie', 'series'],
    idPrefixes: ['tt'],
    catalogs: Object.entries(CATALOGS).map(([id, catalog]) => ({
        type: catalog.type,
        id: `cataloog-${id}`,
        name: catalog.name,
        extra: [{ name: 'skip', isRequired: false }]
    }))
};

// ==================== ADDON ====================

const builder = new addonBuilder(manifest);

/**
 * Handler pour les catalogues
 */
builder.defineCatalogHandler(async ({ type, id, extra }) => {
    console.log(`[Cataloog] Catalogue demandé: ${id} (type: ${type})`);

    const catalogId = id.replace('cataloog-', '');
    const catalog = CATALOGS[catalogId];

    if (!catalog) {
        console.log(`[Cataloog] Catalogue inconnu: ${catalogId}`);
        return { metas: [] };
    }

    const skip = parseInt(extra?.skip) || 0;
    const page = Math.floor(skip / 20) + 1;

    try {
        const results = await catalog.fetch(page);

        console.log(`[Cataloog] ${results.length} résultats pour ${catalog.name}`);

        return { metas: results };
    } catch (error) {
        console.error(`[Cataloog] Erreur catalogue ${id}:`, error.message);
        return { metas: [] };
    }
});

// ==================== SERVEUR ====================

serveHTTP(builder.getInterface(), { port: PORT });

console.log(`
[Cataloog] ========================================
[Cataloog] Cataloog Addon v${manifest.version} démarré!
[Cataloog] Port: ${PORT}
[Cataloog] URL: ${ADDON_URL}
[Cataloog] Manifest: ${ADDON_URL}/manifest.json
[Cataloog] ========================================

[Cataloog] ${Object.keys(CATALOGS).length} catalogues disponibles:

  📈 Tendances:
     - Tendances du jour/semaine (films & séries)

  🏆 Classements:
     - Top Films, Top Séries, Pépites cachées

  🎬 Sorties:
     - Au cinéma, Prochainement

  🎭 Genres:
     - Action, Comédie, Horreur, SF, Thriller, Romance, Drame, Animation, Documentaire

  📺 Séries:
     - Mini-séries, K-Drama, Anime, Docu-séries

  🌍 Par pays:
     - France, Corée, Japon, Inde, Espagne

  🎄 Thématiques:
     - Noël, Halloween, Feel Good, Mind-Bending, Cultes, Famille

  🏆 Récompenses:
     - Oscars

[Cataloog] ========================================
`);
