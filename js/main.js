"use strict";

class ItemsList  {
  constructor() {
    this.items = [];
  }

  fetchItems() {
    return fetch('/goods')
        .then(response => response.json())
        .then((items) => {
          this.items = items;
        })
  }

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
const catalog = document.querySelector('.catalog');
items.fetchItems().then(() => {
  catalog.innerHTML = items.render();
});

class BasketList  {
  constructor() {
    this.basket = [];

    this._output = null;
  }

  //запрашивает с сервера наличие товаров в корзине
  fetchBasket() {
    return fetch('/cart')
        .then(response => response.json())
        .then((item) => {
          this.basket = item;
        })
  }

  checkItems(art) {
    // проверяет есть ли в корзине этот товар
    for (let i = 0; i < this.basket.length; i++) {
      if (this.basket[i].id === art.id) {
        //если есть добавляет количество товара
        this.addQuantityAdd(i);
        this.updateQuantityServer(art.id, i);
        return this.renderQuantity(i, art.id)
      }
    }
    //если нет добавляет товар в корзину
    this.addItem(art);
    return basketOut.innerHTML = this.render();
  }

  //добавляет новый товар в корзину
  addItem(content) {
    this.basket.push(content);
    this.addItemServer(content)
  }

  //добавляет новый товар на сервер
  addItemServer(content){
    fetch(`cart`, {
      method: 'POST',
      body: JSON.stringify(content),
      headers: {
        'Content-type': 'application/json',
      },
    })
  }

  //добавляет количество товара в корзине
  addQuantityAdd(i){
    this.basket[i].quantity++;
  }

  //уменьшает количество товара в корзине
  addQuantityDiminish(art){
    for (let i = 0; i < this.basket.length; i++) {
      if (this.basket[i].id === art) {
        if (this.basket[i].quantity > 1) {
          this.basket[i].quantity--;
          this.updateQuantityServer(art, i);
          this.renderQuantity(i, art);
          return false
        } else if (confirm('Вы действительно хотите удалить товар из корзины?')) {
          return this.delete (i, art);
        } else {
          return false;
        }
      }
    }
  }

  //обновляет количество товара на сервере
  updateQuantityServer(id, i){
    fetch(`/cart/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({quantity: this.basket[i].quantity}),
      headers: {
        'Content-type': 'application/json',
      },
    })
  }

  renderQuantity(i, art){
    const quantityOut = document.getElementsByClassName('quantity_out');
    for (let k = 0; k < quantityOut.length; k++) {
      if (+quantityOut[k].parentNode.dataset.art === art) {
        return quantityOut[k].innerHTML = this.basket[i].quantity;
      }
    }
  }

  //удаляет товар из корзины, с сервера, со страницы
  delete(j, id){
    this.basket.splice(j, 1);
    fetch(`/cart/${id}`, {
      method: 'DELETE',
    }).then(response => response.json());
    return basketOut.innerHTML = this.render()
  }

  //передает необходимые параметры для вывода корзины на страницу
  render() {
    return this.basket.map((item) => new ItemBasket(item.title, item.price, item.img, item.id, item.quantity)
        .render()).join('');
  }

  //вывод общей стоимости товаров на страницу
  outResult() {
    if (!this._output) {
      this._output = document.createElement("div");
      this._output.className = 'output container';
      this._output.innerHTML = `<p>Стоимость всех товаров <span id="total-price">${basket.findPriceGoods()}</span></p>`;
      return this._output;
    } else {
      document.querySelector('#total-price').innerHTML = `${basket.findPriceGoods()}`;
    }
  }

  //подсчет общей стоимости товаров в корзине
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

  // отрисовывает товары из корзины на странице
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

//создание корзины, запрос содержимого корзины с сервера
const basket = new BasketList();
const basketOut = document.querySelector('#basket');
basket.fetchBasket().then(() => {
  console.log(basket);
  if (basket !== []) {
    basketOut.innerHTML = basket.render();
    basket.outResult();
    basketOut.after(basket._output);
  }
});

// const basket = new BasketList();
// const basketOut = document.querySelector('#basket');
//
//слушатель событий в блоке .catalog на кнопку "добавить"
document.querySelector('.catalog').addEventListener('click', (event) => {
  if (event.target.classList.contains('catalog__item_button')) {
    for (const key of items.items) {
      if (+event.target.parentNode.dataset.art === key.id) {
        basket.checkItems(key);
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
        basket.checkItems(key);
        basket.outResult();
        basketOut.after(basket._output);
      }
    }
  } else if (event.target.classList.contains('diminish')){
    for (const key of items.items) {
      if (+event.target.parentNode.dataset.art === key.id) {
        const subtotal = basket.addQuantityDiminish(key.id);
        if (subtotal !== false) {
          basketOut.innerHTML = subtotal;
        }
        basket.outResult();
        basketOut.after(basket._output);
      }
    }
  }
});
