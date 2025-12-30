---
layout: default
title: Blog
---

## Blog

{% if site.posts.size > 0 %}
<div class="posts-list">
{% for post in site.posts %}
<article class="post-preview">
<h3><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h3>
<p class="post-meta">{{ post.date | date: "%B %d, %Y" }}</p>
<p>{{ post.excerpt | strip_html | truncate: 200 }}</p>
<p><a href="{{ post.url | relative_url }}">Read more</a></p>
</article>
{% endfor %}
</div>
{% else %}
<p>No posts yet. Check back soon!</p>
{% endif %}
