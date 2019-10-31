const products = [
  {id: 1, title: 'Notebook', price: 20000, img: 'notebook.jpg'},
  {id: 2, title: 'Mouse', price: 1500, img: 'mouse.jpg'},
  {id: 3, title: 'Keyboard', price: 5000, img: 'keyboard.jpg'},
  {id: 4, title: 'Gamepad', price: 4500, img: 'gamepad.jpg'},
];

const renderProduct = (title, price, img) => {
  return `<div class="product_item">
            <img class="product_item_img" src="images/${img}" alt="photo">
            <div class="product_item_text"><h3 class="product_item_text_h3">${title}</h3>
            <p class="product_item_text_p">Цена: ${price}</p></div>
            <button class="product_item_button button" type="button">Купить</button>
          </div>`;
};

const renderProducts = goodsList => {
  document.querySelector('.product').innerHTML = goodsList.map(good =>
      renderProduct(good.title, good.price, good.img)).join('');
};

renderProducts(products);
