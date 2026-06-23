/* ===========================================================
   config.js
   Website Configuration
   Kenzz SAMP
=========================================================== */

const CONFIG = {

    brand: {
        title: "Kenzz SAMP",
        navbarLogo: "Kenzz SAMP",
        footerLogo: "Kenzz SAMP"
    },

    footer: {
        description:
            "Download MonetLoader, CLEO, plugin, dan resource GTA SA-MP Android terbaru dengan tampilan modern dan ringan.",

        copyright:
            `© ${new Date().getFullYear()} Kenzz SAMP. All rights reserved.`
    },

    social: {

        discord:
            "https://discord.gg/SKCgURKkAt",

        youtube:
            "https://youtube.com/@KenzzYeTe",

        tiktok:
            "https://www.tiktok.com/@kenzzyete",

        github:
            "https://github.com/",

        telegram:
            "#",

        instagram:
            "#"

    },

    footerLinks: [

        {
            title: "About",
            href: "about.html"
        },

        {
            title: "Privacy",
            href: "privacy.html"
        },

        {
            title: "Terms",
            href: "terms.html"
        },

        {
            title: "Contact",
            href: "contact.html"
        }

    ]

};


/* ===========================================================
   RENDER NAVBAR
=========================================================== */

(function () {

    const navbar = document.getElementById("navbar-root");

    if (!navbar) return;

    navbar.innerHTML = `

        <div class="navbar-container">

            <a href="index.html"
               class="navbar-logo">

                ${CONFIG.brand.navbarLogo}

            </a>

            <div class="navbar-actions">

                <button
                    id="searchButton"
                    class="icon-btn"
                    title="Search">

                    <i class="fa-solid fa-magnifying-glass"></i>

                </button>

                <button
                    id="themeToggle"
                    class="icon-btn"
                    title="Theme">

                    <i class="fa-solid fa-moon"></i>

                </button>

            </div>

        </div>

    `;

})();


/* ===========================================================
   RENDER FOOTER
=========================================================== */

(function () {

    const footer = document.getElementById("footer-root");

    if (!footer) return;

    footer.innerHTML = `

        <div class="footer-container">

            <div class="footer-brand">

                <h2>

                    ${CONFIG.brand.footerLogo}

                </h2>

                <p>

                    ${CONFIG.footer.description}

                </p>

            </div>

            <div class="footer-social">

                <a href="${CONFIG.social.discord}" target="_blank">

                    <i class="fa-brands fa-discord"></i>

                </a>

                <a href="${CONFIG.social.youtube}" target="_blank">

                    <i class="fa-brands fa-youtube"></i>

                </a>

                <a href="${CONFIG.social.tiktok}" target="_blank">

                    <i class="fa-brands fa-tiktok"></i>

                </a>

                <a href="${CONFIG.social.github}" target="_blank">

                    <i class="fa-brands fa-github"></i>

                </a>

                <a href="${CONFIG.social.telegram}" target="_blank">

                    <i class="fa-brands fa-telegram"></i>

                </a>

                <a href="${CONFIG.social.instagram}" target="_blank">

                    <i class="fa-brands fa-instagram"></i>

                </a>

            </div>

            <div class="footer-links">

                ${CONFIG.footerLinks.map(link => `

                    <a href="${link.href}">

                        ${link.title}

                    </a>

                `).join("")}

            </div>

            <div class="footer-copy">

                ${CONFIG.footer.copyright}

            </div>

        </div>

    `;

})();
