<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
	version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:atom="http://www.w3.org/2005/Atom"
>
	<xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes" />

	<xsl:template match="/">
		<html lang="en">
			<head>
				<meta charset="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<title>
					<xsl:value-of select="rss/channel/title" />
					<xsl:text> RSS Feed</xsl:text>
				</title>
				<style>
					:root {
						color-scheme: light dark;
						--accent: #2196f3;
						--accent-strong: #3367d6;
						--accent-soft: rgba(33, 150, 243, 0.12);
						--background: #f4f7fb;
						--background-elevated: #edf3fb;
						--surface: rgba(255, 255, 255, 0.82);
						--surface-strong: #ffffff;
						--surface-muted: rgba(255, 255, 255, 0.62);
						--text-strong: rgba(18, 25, 38, 0.96);
						--text: rgba(18, 25, 38, 0.82);
						--text-muted: rgba(18, 25, 38, 0.58);
						--text-meta: rgba(18, 25, 38, 0.32);
						--border: rgba(18, 25, 38, 0.10);
						--border-strong: rgba(18, 25, 38, 0.16);
						--shadow-head: 0 16px 40px rgba(15, 23, 42, 0.08);
						--shadow-card: 0 22px 48px rgba(15, 23, 42, 0.10);
						--shadow-focus: 0 0 0 4px rgba(33, 150, 243, 0.18);
					}

					@media (prefers-color-scheme: dark) {
						:root {
							--accent: #7ecbff;
							--accent-strong: #a8ddff;
							--accent-soft: rgba(126, 203, 255, 0.16);
							--background: #0b1118;
							--background-elevated: #111925;
							--surface: rgba(18, 27, 40, 0.86);
							--surface-strong: #151e2b;
							--surface-muted: rgba(18, 27, 40, 0.72);
							--text-strong: rgba(241, 245, 249, 0.96);
							--text: rgba(241, 245, 249, 0.82);
							--text-muted: rgba(241, 245, 249, 0.62);
							--text-meta: rgba(241, 245, 249, 0.34);
							--border: rgba(148, 163, 184, 0.16);
							--border-strong: rgba(148, 163, 184, 0.24);
							--shadow-head: 0 18px 48px rgba(2, 6, 23, 0.42);
							--shadow-card: 0 26px 56px rgba(2, 6, 23, 0.48);
							--shadow-focus: 0 0 0 4px rgba(126, 203, 255, 0.22);
						}
					}

					* {
						box-sizing: border-box;
					}

					html {
						background-color: var(--background);
						scroll-behavior: smooth;
						scrollbar-width: thin;
						scrollbar-color: var(--border-strong) transparent;
					}

					body {
						margin: 0;
						min-height: 100vh;
						font-family: "Atkinson Hyperlegible", "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
						font-size: 18px;
						line-height: 1.8;
						color: var(--text);
						background:
							radial-gradient(circle at top left, rgba(33, 150, 243, 0.18), transparent 24rem),
							radial-gradient(circle at top right, rgba(70, 136, 241, 0.10), transparent 18rem),
							linear-gradient(180deg, #fbfdff 0%, #f4f7fb 42%, #eef3f9 100%);
						text-align: left;
						text-rendering: optimizeLegibility;
						word-break: normal;
						overflow-wrap: break-word;
					}

					@media (prefers-color-scheme: dark) {
						body {
							background:
								radial-gradient(circle at top left, rgba(126, 203, 255, 0.12), transparent 22rem),
								radial-gradient(circle at top right, rgba(51, 103, 214, 0.12), transparent 18rem),
								linear-gradient(180deg, #0b1118 0%, #0f1722 46%, #111b29 100%);
						}
					}

					a {
						color: var(--accent-strong);
						text-decoration: none;
						text-underline-offset: 0.18em;
						transition: color 160ms ease, border-color 160ms ease, box-shadow 160ms ease, transform 160ms ease;
					}

					a:hover {
						color: var(--accent);
					}

					.shell {
						width: min(72rem, calc(100% - 2rem));
						margin: 0 auto;
						padding: 2rem 0 4rem;
					}

					.hero {
						position: relative;
						overflow: hidden;
						padding: 2rem;
						border: 1px solid var(--border);
						border-radius: 32px;
						background: linear-gradient(180deg, var(--surface) 0%, var(--surface-strong) 100%);
						box-shadow: var(--shadow-head);
						backdrop-filter: blur(12px);
					}

					.hero::before {
						content: "";
						position: absolute;
						inset: -4rem auto auto -3rem;
						width: 16rem;
						height: 16rem;
						border-radius: 999px;
						background: radial-gradient(circle, var(--accent-soft) 0%, rgba(33, 150, 243, 0) 72%);
						pointer-events: none;
					}

					.badge {
						display: inline-flex;
						align-items: center;
						gap: 0.5rem;
						padding: 0.45rem 0.85rem;
						border-radius: 999px;
						background: var(--accent-soft);
						color: var(--accent-strong);
						font-size: 0.78rem;
						font-weight: 700;
						letter-spacing: 0.08em;
						text-transform: uppercase;
					}

					h1,
					h2,
					h3,
					h4,
					h5,
					h6 {
						margin: 0 0 0.75rem;
						color: var(--text-strong);
						line-height: 1.1;
						letter-spacing: -0.025em;
					}

					h1 {
						margin-top: 1rem;
						font-size: clamp(2.75rem, 6vw, 4.5rem);
					}

					h2 {
						font-size: clamp(1.45rem, 3vw, 2rem);
					}

					.description {
						max-width: 46rem;
						margin: 0;
						color: var(--text-muted);
					}

					.meta-grid {
						display: grid;
						grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
						gap: 1rem;
						margin-top: 1.5rem;
					}

					.meta-card {
						padding: 1rem;
						border: 1px solid var(--border);
						border-radius: 24px;
						background: var(--surface-muted);
					}

					.meta-label {
						display: block;
						margin-bottom: 0.35rem;
						color: var(--text-meta);
						font-size: 0.72rem;
						font-weight: 700;
						letter-spacing: 0.08em;
						text-transform: uppercase;
					}

					.meta-value {
						color: var(--text-strong);
						word-break: break-word;
					}

					.note {
						margin-top: 1.5rem;
						padding: 1rem 1.25rem;
						border: 1px solid var(--border);
						border-left: 4px solid var(--accent);
						border-radius: 24px;
						background: var(--background-elevated);
						color: var(--text-muted);
					}

					.list {
						display: grid;
						gap: 1rem;
						margin-top: 1.5rem;
					}

					.item {
						padding: 1.5rem;
						border: 1px solid var(--border);
						border-radius: 24px;
						background: var(--surface);
						box-shadow: var(--shadow-card);
						backdrop-filter: blur(10px);
						transition: transform 160ms ease, border-color 160ms ease, box-shadow 160ms ease;
					}

					.item:hover {
						transform: translateY(-2px);
						border-color: var(--border-strong);
					}

					.item-head {
						display: flex;
						align-items: flex-start;
						justify-content: space-between;
						gap: 1rem;
						margin-bottom: 0.75rem;
					}

					.item-date {
						flex-shrink: 0;
						padding: 0.35rem 0.75rem;
						border-radius: 999px;
						background: var(--accent-soft);
						color: var(--accent-strong);
						font-size: 0.82rem;
						line-height: 1.4;
						white-space: nowrap;
					}

					.item-desc {
						margin: 0;
						color: var(--text-muted);
					}

					.tags {
						display: flex;
						flex-wrap: wrap;
						gap: 0.5rem;
						margin-top: 1rem;
					}

					.tag {
						padding: 0.28rem 0.7rem;
						border-radius: 999px;
						background: var(--accent-soft);
						color: var(--accent-strong);
						font-size: 0.8rem;
					}

					.empty {
						padding: 1.5rem;
						border: 1px dashed var(--border-strong);
						border-radius: 24px;
						background: var(--surface-muted);
						color: var(--text-muted);
					}

					::-webkit-scrollbar {
						width: 6px;
						height: 6px;
					}

					::-webkit-scrollbar-track {
						background: transparent;
					}

					::-webkit-scrollbar-thumb {
						background: var(--border-strong);
						border-radius: 999px;
					}

					::-webkit-scrollbar-thumb:hover {
						background: var(--text-meta);
					}

					@media (max-width: 768px) {
						body {
							font-size: 17px;
						}

						.shell {
							width: min(100% - 1rem, 72rem);
							padding-top: 1rem;
							padding-bottom: 2rem;
						}

						.hero,
						.item {
							padding: 1.25rem;
							border-radius: 24px;
						}

						.item-head {
							flex-direction: column;
						}
					}
				</style>
			</head>
			<body>
				<div class="shell">
					<section class="hero">
						<div class="badge">RSS Feed</div>
						<h1>
							<xsl:value-of select="rss/channel/title" />
						</h1>
						<p class="description">
							<xsl:value-of select="rss/channel/description" />
						</p>

						<div class="meta-grid">
							<div class="meta-card">
								<span class="meta-label">Website</span>
								<div class="meta-value">
									<a href="{rss/channel/link}">
										<xsl:value-of select="rss/channel/link" />
									</a>
								</div>
							</div>
							<div class="meta-card">
								<span class="meta-label">Feed URL</span>
								<div class="meta-value">
									<xsl:choose>
										<xsl:when test="rss/channel/atom:link[@rel='self']/@href">
											<a href="{rss/channel/atom:link[@rel='self']/@href}">
												<xsl:value-of select="rss/channel/atom:link[@rel='self']/@href" />
											</a>
										</xsl:when>
										<xsl:otherwise>Current page URL</xsl:otherwise>
									</xsl:choose>
								</div>
							</div>
							<div class="meta-card">
								<span class="meta-label">Items</span>
								<div class="meta-value">
									<xsl:value-of select="count(rss/channel/item)" />
									<xsl:text> posts</xsl:text>
								</div>
							</div>
							<xsl:if test="rss/channel/lastBuildDate">
								<div class="meta-card">
									<span class="meta-label">Updated</span>
									<div class="meta-value">
										<xsl:value-of select="rss/channel/lastBuildDate" />
									</div>
								</div>
							</xsl:if>
						</div>

						<div class="note">
							This browser preview keeps the feed readable while preserving the original XML underneath. Paste the feed URL into any RSS reader to subscribe.
						</div>
					</section>

					<section class="list">
						<xsl:choose>
							<xsl:when test="count(rss/channel/item) &gt; 0">
								<xsl:for-each select="rss/channel/item">
									<article class="item">
										<div class="item-head">
											<h2>
												<a href="{link}">
													<xsl:value-of select="title" />
												</a>
											</h2>
											<xsl:if test="pubDate">
												<div class="item-date">
													<xsl:value-of select="pubDate" />
												</div>
											</xsl:if>
										</div>

										<xsl:if test="description">
											<p class="item-desc">
												<xsl:value-of select="description" />
											</p>
										</xsl:if>

										<xsl:if test="category">
											<div class="tags">
												<xsl:for-each select="category">
													<span class="tag">
														<xsl:value-of select="." />
													</span>
												</xsl:for-each>
											</div>
										</xsl:if>
									</article>
								</xsl:for-each>
							</xsl:when>
							<xsl:otherwise>
								<div class="empty">No feed items are available yet.</div>
							</xsl:otherwise>
						</xsl:choose>
					</section>
				</div>
			</body>
		</html>
	</xsl:template>
</xsl:stylesheet>