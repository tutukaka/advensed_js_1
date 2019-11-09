"use strict";
/*
сервер запусккается при помощи Node js  из терминала редактора
при помощи команд
npm i -g json-server
json-server --watch db.json --port 3012 --static ./
*/
const app = new Vue({
    el: '#root',
    data: {
        items: [],
        filteredItems: [],
        basket: [],
        query: '',
        nothingFound: 'Ничего не найдено!'
    },
    methods: {
        handleSearchClick() {
            this.filteredItems = this.items.filter((item) => {
                const regexp = new RegExp(this.query, 'i');
                return regexp.test(item.title);
            });
        },

        handleBuyClick(item) {
            // проверяет есть ли в корзине этот товар
            for (let i = 0; i < this.basket.length; i++) {
                if (this.basket[i].id === item.id) {
                    //если есть добавляет количество товара
                    return this.addQuantityAdd(item.id, i);
                }
            }
            //если нет добавляет товар в корзину
            item.quantity = 1;
            this.basket.push(item);
            return fetch(`cart`, {
                method: 'POST',
                body: JSON.stringify(item),
                headers: {
                    'Content-type': 'application/json',
                },
            })
        },
        addQuantityAdd(id, i){
            this.basket[i].quantity++;
            return fetch(`/cart/${id}`, {
                method: 'PATCH',
                body: JSON.stringify({quantity: this.basket[i].quantity}),
                headers: {
                    'Content-type': 'application/json',
                },
            })
        },
        addQuantityDiminish(id){
            for (let i = 0; i < this.basket.length; i++) {
                if (this.basket[i].id === id) {
                    if (this.basket[i].quantity > 1) {
                        this.basket[i].quantity--;
                        this.updateQuantityServer(id, i);
                        this.renderQuantity(i, id);
                        return false
                    } else if (confirm('Вы действительно хотите удалить товар из корзины?')) {
                        return this.handleDeleteClick(id);
                    } else {
                        return false;
                    }
                }
            }
        },

        handleDeleteClick(id) {
            fetch(`/cart/${id}`, {
                method: 'DELETE',}).then(() => {
                console.log(this.basket = this.basket.filter((item) => item.id !== id));
                this.basket = this.basket.filter((item) => item.id !== id);
            });
        }
    },
    mounted() {
        fetch('/goods')
            .then(response => response.json())
            .then((goods) => {
                this.items = goods;
                this.filteredItems = goods;
            });

        fetch('/cart')
            .then(response => response.json())
            .then((cart) => {
                this.basket = cart;
            });
    },
    computed: {
        total() {
            return this.basket.reduce((acc, item) => acc + item.quantity * item.price, 0);
        }
    }
});