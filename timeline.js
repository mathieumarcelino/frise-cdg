function convertDate(date) {
    const [day, month, year] = date.split("/");

    return `${year}-${month}-${day}`;
}

function transformDate(dateString) {
    let parts = dateString.split("/");
    let date = new Date(parts[2], parts[1] - 1, parts[0]);
    let options = { year: 'numeric', month: 'short', day: 'numeric' };
    let frenchDate = date.toLocaleDateString('fr-FR', options);

    return frenchDate;
}



fetch(`https://mathieumarcelino.com/fondationcdg/wp-json/wp/v2/posts?categories=8`)
    .then(response => response.json())
    .then(data => {
        data.sort((a, b) => {
            const aDate = new Date(convertDate(a.meta_fields.date[0]));
            const bDate = new Date(convertDate(b.meta_fields.date[0]));
            return aDate - bDate;
        });

        const timelineElement = document.getElementById('timeline');

        for (let post of data) {
            const postElement = document.createElement('div');
            postElement.classList.add('timeline-post');

            const contentElement = document.createElement('div');
            contentElement.classList.add('post-content');

            const arrowElement = document.createElement('div');
            arrowElement.classList.add('post-arrow');
            contentElement.appendChild(arrowElement);

            const dotElement = document.createElement('div');
            dotElement.classList.add('post-dot');
            contentElement.appendChild(dotElement);

            const dateElement = document.createElement('div');
            dateElement.classList.add('post-date');
            dateElement.innerHTML = transformDate(post.meta_fields.date[0]);
            contentElement.appendChild(dateElement);

            const titleElement = document.createElement('div');
            titleElement.classList.add('post-title');
            titleElement.innerHTML = post.title.rendered;
            contentElement.appendChild(titleElement);

            const textElement = document.createElement('div');
            textElement.classList.add('post-text');
            textElement.innerHTML = post.content.rendered;
            contentElement.appendChild(textElement);

            if (post.featured_image_url) {
                const imgElement = document.createElement('img');
                imgElement.src = post.featured_image_url;
                contentElement.appendChild(imgElement);
            }

            if (post.meta_fields.pdf_url) {
                const pdfElement = document.createElement('div');
                const linkElement = document.createElement('a');
                pdfElement.classList.add('link-text');
                linkElement.href = post.meta_fields.pdf_url[0];
                linkElement.innerHTML = 'Lien vers le PDF';
                pdfElement.appendChild(linkElement);
                contentElement.appendChild(pdfElement);
            }

            postElement.appendChild(contentElement);

            timelineElement.appendChild(postElement);
        }
    });
