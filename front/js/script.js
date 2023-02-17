fetch("http://localhost:3000/api/products")
.then(response => response.json())
.then(items => displayItems(items))
  

function displayItems(items) {
    items.forEach(item => {
      
      const {altTxt, description, imageUrl, name, _id } = item;
      
      const href = `./product.html?id=${_id}`;
      
      const article = document.createElement('article');
      
      const img = document.createElement('img');
      img.src = imageUrl;
      img.alt = altTxt;
      
      const h3 = document.createElement('h3');
      h3.textContent = name;
      
      const p = document.createElement('p');
      p.textContent = description;
      
      article.appendChild(img);
      article.appendChild(h3);
      article.appendChild(p);
      
      const a = document.createElement('a');
      a.href = href;
      
      a.appendChild(article);
      document.getElementById("items").appendChild(a);
    });
  } 



