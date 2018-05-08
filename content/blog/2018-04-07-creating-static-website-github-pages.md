---
title: Creating a personal website with Github Pages
tags: ["Github", "CDN"]
publish: false
edit_date: false
---

When I first wanted to put my own website online, I found 

In this blog post we will be setting up a static webpage hosted with Github pages, and using Cloudflare as a CDN and for https.
<br/>

## Github repo

Head on over to github.com and create a new repository. You need to name the repository "yourgithubusername.github.io".

Once you've created the repository on github, we're going to create a git repository on our machine. 

New to Git? [Here's a tutorial that will teach you the basics](https://try.github.io/levels/1/challenges/1)

```bash
mkdir personal_website && cd personal_website
git init
echo "# My Website" > README.md
```

If you already have HTML/CSS/JS files to use, you can move them into this folder. Otherwise we'll create them now.

```bash
touch index.html app.css app.js
```

Next, create a CNAME file with your domain's URL (do not include the www.)

```bash
echo "mywebsite.com" > CNAME
```
Now that the code for our site is ready, let's push it to github.

```bash
git add .
git add remote origin https://github.com/username/username.github.io.git
git commit -m "My first commit."
git push origin master
```

Refresh the github repository in your browser and you should see your code in the repository.


## Registering a domain

If you don't already have a domain to use, you can pick one up at [ Namecheap ](https://namecheap.com/) or [ Google Domains ](https://domains.google.com) which will cost ~$12 per year.

If you're a student, you can get a free (for one year) .me domain [ through Namecheap ](https://nc.me/).

Once you have a domain to use, We're going to set it up to.



## Connecting CloudFlare

Why use CloudFlare?
provides benefits such as scrape shield, auto-minifying HTML, CSS, and JS files, a

http://appleplugs.com/
https://stories.nicer.io/we-launched-our-company-with-a-parody-product-600ffbbe0173#.o5nhoz2aj


Head over to [ CloudFlare.com ](https://cloudflare.com/) and sign up for an account. You'll be asked to add your domain and a short video will play while they're scanning your DNS records.

They'll then give you two custom DNS records. Head over to your domain registrar and update your DNS nameservers to the new CloudFlare records. Here's what it looks like on Namecheap:


Once you've done that, go back to CloudFlare and click on the DNS tab at the top. You'll need to update your DNS records on CloudFlare to point your A records to github using the following IP Addresses:

```
192.30.252.153
192.30.252.154
``` 

Then create a CNAME record aliasing www to yourusername.github.io. That will look like this on CloudFlare.



#### Cloudflare settings

There are a few setting's you'll probably want to change in Cloudflare to improve your website. 

## Wrapping up

It might take a few minutes for the DNS changes to propogate, but you should be able to access your website at your new URL and your github setting's tab should show that your site has been deployed.

