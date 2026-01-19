<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9">

    <xsl:output method="html" indent="yes"/>

    <xsl:template match="/">
        <html>
            <head>
                <title>Sitemap for questpodai.com</title>
                <style>
                    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; margin: 2em; background-color: #f4f7f9; color: #333; }
                    h1 { color: #004d99; text-align: center; }
                    table { width: 100%; border-collapse: collapse; margin-top: 2em; background-color: #fff; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
                    th, td { padding: 12px 15px; text-align: left; border-bottom: 1px solid #ddd; }
                    th { background-color: #005fcc; color: #fff; font-weight: bold; text-transform: uppercase; }
                    tr:hover { background-color: #f1f1f1; }
                    a { color: #007bff; text-decoration: none;}
                    a:hover { text-decoration: underline; }
                </style>
            </head>
            <body>
                <h1>Sitemap for questpodai.com</h1>
                <table>
                    <thead>
                        <tr>
                            <th>URL</th>
                            <th>Last Modified</th>
                            <th>Change Frequency</th>
                            <th>Priority</th>
                        </tr>
                    </thead>
                    <tbody>
                        <xsl:apply-templates select="sitemap:urlset/sitemap:url"/>
                    </tbody>
                </table>
            </body>
        </html>
    </xsl:template>

    <xsl:template match="sitemap:url">
        <tr>
            <td><a href="{sitemap:loc}" target="_blank"><xsl:value-of select="sitemap:loc"/></a></td>
            <td><xsl:value-of select="sitemap:lastmod"/></td>
            <td><xsl:value-of select="sitemap:changefreq"/></td>
            <td><xsl:value-of select="sitemap:priority"/></td>
        </tr>
    </xsl:template>

</xsl:stylesheet>