var Evnet = new Vue()

function copy(obj) {
    return Object.assign({}, obj)
}

Vue.component('task', {
    template: '#task-tpl',
    props: ['todo'],
    methods: {
        action: function (name, params) {
            Evnet.$emit(name, params)
        }
    }
})

new Vue({
    el: '#app',
    data: {
        list: [],
        last_id: 0,
        current: {},
    },

    mounted: function () {
        var me = this
        this.list = ms.get('list') || this.list
        this.last_id = ms.get('list') || this.last_id
        Evnet.$on('remove', function (id) {
            if (id) {
                me.remove(id)
            }
        })
        Evnet.$on('toggle_complete', function (id) {
            if (id) {
                me.toggle_complete(id)
            }
        })
        Evnet.$on('set_current', function (id) {
            if (id) {
                me.set_current(id)
            }
        })
    },

    methods: {
        /**
         * add和update合并为merge
         */
        merge: function () {
            let is_update, id
            is_update = id = this.current.id

            if (is_update) {
                let index = this.find_index(id)
                Vue.set(this.list, index, copy(this.current))

            } else {
                var title = this.current.title
                if (!title) { return; }
                let todo = copy(this.current)
                this.last_id = this.last_id + 1
                ms.set('last_id', this.last_id)
                todo.id = this.last_id + 1
                this.list.push(todo)
            }
            this.reset_current()
        },
        remove: function (id) {
            let index = this.find_index(id)
            this.list.splice(index, 1)
        },
        toggle_complete: function (id) {
            let i = this.find_index(id)
            Vue.set(this.list[i], 'completed', !this.list[i].completed)
        },
        next_id: function () {
            return this.list.length + 1
        },
        set_current: function (todo) {
            this.current = copy(todo)
        },
        reset_current: function () {
            this.set_current({})
        },
        find_index: function (id) {
            return this.list.findIndex(function (item) {
                return item.id == id
            })
        },
    },

    watch: {
        list: {
            deep: true,
            handler: function (n, o) {
                if (n) {
                    ms.set('list', n)
                } else {
                    ms.set('list', [])
                }
            }
        }
    },
})








