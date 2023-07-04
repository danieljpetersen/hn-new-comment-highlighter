// ==UserScript==
// @name HN New Comment Highlighter
// @namespace http://tampermonkey.net/
// @version 1.0.0
// @description Highlights unread comments in Hacker News threads
// @author danieljpetersen
// @match https://news.ycombinator.com/item?*
// @grant GM_getValue
// @grant GM_setValue
// ==/UserScript==
(function() {
    'use strict';
    var css = ".hn-new-post { background: skyblue; }";
    var style = document.createElement('style');
    style.type = 'text/css';
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);
    function highlight() {
        var urlParams = new URLSearchParams(window.location.search);
        var page_id = urlParams.get('id');
        if (!page_id) return;
        var data = GM_getValue(page_id, {visited: false, posts: {}});
        var old_posts = data.posts;
        var posts = [].map.call(document.querySelectorAll("td.default"), function(element) {
            var identifying_tag = element.querySelector(":scope a[href^='item?']");
            if (!identifying_tag) return {};
            var href = identifying_tag.href || "";
            var post_id = href.slice(href.lastIndexOf("id=") + 3);
            return { "id": post_id, "element": element };
        }).filter(function(post) { return post.id; });
        if (data.visited) {
            posts.forEach(function(post) {
                if (!(post.id in old_posts)) {
                    post.element.className += " hn-new-post";
                }
            });
        }
        var update = posts.reduce(function(accumulator, post) {
            accumulator[post.id] = true;
            return accumulator;
        }, {});
        GM_setValue(page_id, {visited: true, posts: update});
    }
    highlight();
})();
