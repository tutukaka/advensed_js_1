"use strict";

class ItemsList  {
  constructor() {
    this.items = [];
  }

  fetchItems() {
    this.items = [
      { id: 21566, title: 'Mouse', price: 400, img: 'mouse.jpg', quantity: 1 },
      { id: 22563, title: 'Notebook', price: 20000, img: 'notebook.jpg', quantity: 1 },
      { id: 23766, title: 'Keyboard', price: 5000, img: 'keyboard.jpg', quantity: 1 },
      { id: 24526, title: 'Gamepad', price: 4500, img: 'gamepad.jpg', quantity: 1 },
    ]}

  render() {
    return this.items.map((item) => new Item(item.title, item.price, item.img, item.id)
        .render()).join('');
  }
}

class Item {
  constructor(title, price, image, id) {
    this.price = price;
    this.title = title;
    this.img = image;
    this.id = id;
  }

  render() {
    return `<div data-art="${this.id}" class="catalog__item bxbb">
            <img class="catalog__item_img" src="images/${this.img}" 
            alt="photo">
            <h3 class="catalog__item_text_h3">${this.title}</h3>
            <p class="catalog__item_text_p">цена: ${this.price}р</p>
            <button class="button catalog__item_button" type="button">добавить</button></div>`
  }
}
const items = new ItemsList ();
items.fetchItems();

const catalog = document.querySelector('.catalog');
catalog.innerHTML = items.render();

class BasketList  {
  constructor() {
    this.basket = [];

    this._output = null
  }

  checkItems(art) {
    // проверяет есть ли в корзине этот товар
    for (let i = 0; i < this.basket.length; i++) {
      if (this.basket[i].id === art.id) {
        //если есть добавляет количество товара
        this.basket[i].quantity++;
        return this.render();
      }
    }
    //если нет добавляет обект в корзину
    this.addItem(art);
    console.log(basket);
    return this.render();
  }

  checkItems2(art){
    for (let i = 0; i < this.basket.length; i++) {
      if (this.basket[i].id === art) {
        //если есть добавляет количество товара
        this.basket[i].quantity--;
        return this.render();
      }
    }
  }

  addItem(content){
    return this.basket.push(content);
  }

  render() {
    return this.basket.map((item) => new ItemBasket(item.title, item.price, item.img, item.id, item.quantity)
        .render()).join('');
  }

  outResult() {
    if (!this._output) {
      this._output = document.createElement("div");
      this._output.className = 'output container';
      this._output.innerHTML = `<p>Стоимость всех товаров 
        <span id="total-price">${basket.findPriceGoods()}</span></p>`;
      return this._output;
    } else {
      document.querySelector('#total-price').innerHTML = `${basket.findPriceGoods()}`;    }
  }

  findPriceGoods(){
    let summ = null;
    this.basket.forEach((item) => {
      summ += item.price * item.quantity
    });
    return summ;
  }
}

class ItemBasket extends  Item{
  constructor(title, price, image, id, quantity){
    super(title, price, image, id,);
    this.quantity = quantity;
  }
  render() {
    return `<div data-art="${this.id}" class="basket__item bxbb">
            <img class="basket__item_img" src="images/${this.img}" 
            alt="photo">
            <h3 class="basket__item_text_h3">${this.title}</h3>
            <p class="basket__item_text_p">цена: ${this.price}р</p>
            <button class="button basket_button add" type="button">+</button>
            <div class="quantity_out">${this.quantity}</div>
            <button class="diminish button basket_button" type="button">-</button></div>` ;

  }
}

const basket = new BasketList();
const basketOut = document.querySelector('#basket');

document.querySelector('.catalog').addEventListener('click', (event) => {
  if (event.target.classList.contains('catalog__item_button')) {
    for (const key of items.items) {
      if (+event.target.parentNode.dataset.art === key.id) {
        basketOut.innerHTML = basket.checkItems(key);
        basket.outResult();
        basketOut.after(basket._output);
      }
    }
  }
});

//слушатель событий в блоке #basket на кнопки "+" и "-"
document.getElementById('basket').addEventListener('click', (event) => {
  if (event.target.classList.contains('add')){
    for (const key of items.items) {
      if (+event.target.parentNode.dataset.art === key.id) {
        basketOut.innerHTML = basket.checkItems(key);
        basket.outResult();
        basketOut.after(basket._output);
      }
    }
  } else if (event.target.classList.contains('diminish')){
    for (const key of items.items) {
      if (+event.target.parentNode.dataset.art === key.id) {
        const subtotal = basket.checkItems2(key.id);
        if (subtotal !== false) {
          basketOut.innerHTML = subtotal;
        }
        basket.outResult();
        basketOut.after(basket._output);
      }
    }
  }});
