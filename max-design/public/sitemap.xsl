<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:sm="http://www.sitemaps.org/schemas/sitemap/0.9">
<xsl:output method="html" encoding="UTF-8" indent="yes"/>
<xsl:template match="/">
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <title>XML Sitemap</title>
  <style>
    body{margin:0;background:#fff;color:#222;font-family:Helvetica,Arial,sans-serif;font-size:13px;padding:30px 16px}
    .wrap{max-width:1000px;margin:0 auto}
    h1{font-size:24px;margin:0 0 14px;color:#d9433f;font-weight:700}
    p{margin:0 0 10px;color:#444}
    p a{color:#d9433f;font-weight:700;text-decoration:none}
    table{width:100%;border-collapse:collapse;margin-top:22px}
    th{text-align:left;padding:8px 6px;border-bottom:2px solid #999;font-size:12px;font-weight:700;color:#333}
    td{padding:5px 6px;font-size:12px}
    tr:nth-child(even) td{background:#f1f1f1}
    td a{color:#111;text-decoration:none}
    td a:hover{text-decoration:underline}
    .n{width:90px}
    .d{width:190px;white-space:nowrap}
  </style>
</head>
<body>
  <div class="wrap">
    <h1>XML Sitemap</h1>
    <p>This is a XML Sitemap which is supposed to be processed by search engines which follow the XML Sitemap standard like Ask.com, Bing, Google and Yahoo.</p>
    <p>You can find more information about XML sitemaps on <a href="https://www.sitemaps.org/">sitemaps.org</a>.</p>
    <p>This XML Sitemap contains <xsl:value-of select="count(sm:urlset/sm:url)"/> URLs.</p>
    <table>
      <tr><th>URL</th><th class="n">Images</th><th class="d">Last Mod.</th></tr>
      <xsl:for-each select="sm:urlset/sm:url">
        <tr>
          <td><a href="{sm:loc}"><xsl:value-of select="sm:loc"/></a></td>
          <td class="n">0</td>
          <td class="d">
            <xsl:value-of select="substring(sm:lastmod,1,10)"/>
            <xsl:text> </xsl:text>
            <xsl:value-of select="substring(sm:lastmod,12,5)"/>
            <xsl:text> +00:00</xsl:text>
          </td>
        </tr>
      </xsl:for-each>
    </table>
  </div>
</body>
</html>
</xsl:template>
</xsl:stylesheet>