new Vue({
	el: "#app",
	data: {
		list: [{
				id: 5,
				img: 'img/j1.png',
				title: '五等奖'
			},
			{
				id: 1,
				img: 'img/j2.png',
				title: '一等奖'
			},
			{
				id: 3,
				img: 'img/j3.png',
				title: '三等奖'
			},
			{
				id: 6,
				img: 'img/j4.png',
				title: '六等奖'
			},
			{
				id: 5,
				img: 'img/j1.png',
				title: '五等奖'
			},
			{
				id: 2,
				img: 'img/j6.png',
				title: '二等奖'
			},
			{
				id: 4,
				img: 'img/j5.png',
				title: '四等奖'
			},
			{
				id: 3,
				img: 'img/j3.png',
				title: '三等奖'
			}
		], //奖品1-9   
		isStart: 1,
		score: 10, //消耗积分  
		index: -1, // 当前转动到哪个位置，起点位置
		count: 8, // 总共有多少个位置
		timer: 0, // 每次转动定时器
		speed: 200, // 初始转动速度
		times: 0, // 转动次数
		cycle: 50, // 转动基本次数：即至少需要转动多少次再进入抽奖环节
		prize: -1, // 中奖位置
		click: true,
		showToast: false, //显示中奖弹窗
		showCode: true, //显示邀请码弹窗
		code: '', //邀请码
		award: -1 //中奖号
	},

	mounted() {},

	methods: {
		startLottery() {
			if (!this.click) {
				return false;
			}
			this.startRoll();
		},
		// 开始转动
		startRoll() {
			this.click = false;
			this.times += 1 // 转动次数
			this.oneRoll() // 转动过程调用的每一次转动方法，这里是第一次调用初始化 
			// 如果当前转动次数达到要求 && 目前转到的位置是中奖位置
			if (this.times > this.cycle + 10 && this.prize === this.index) {
				clearTimeout(this.timer) // 清除转动定时器，停止转动
				this.prize = -1
				this.times = 0
				this.speed = 200
				this.click = true;
				var that = this;
				setTimeout(res => {
					that.showToast = true;
				}, 500)
			} else {
				if (this.times < this.cycle) {
					this.speed -= 10 // 加快转动速度
				} else if (this.times === this.cycle) {
					this.prize = this.list.map(item => item.id).indexOf(this.award); //中奖位置,可由后台返回
				} else if (this.times > this.cycle + 10 && ((this.prize === 0 && this.index === 7) || this.prize === this.index +
						1)) {
					this.speed += 110
				} else {
					this.speed += 20
				}
				if (this.speed < 40) {
					this.speed = 40
				}
				this.timer = setTimeout(this.startRoll, this.speed)
			}
		},
		// 每一次转动
		oneRoll() {
			let index = this.index // 当前转动到哪个位置
			const count = this.count // 总共有多少个位置
			index += 1
			if (index > count - 1) {
				index = 0
			}
			this.index = index
		},
		close() {
			this.showCode = false;
			this.code = '';
		},
		submit() { //提交邀请码
			if (!this.code) {
				if (this.showCode) {
					alert('邀请码有误')
				} else {
					this.showCode = true;
				}
				return
			}
			let data = {
				code: this.code
			}

			//模拟请求成功
			// this.showCode = false;
			// this.startLottery();
			// this.award = 4 //parseInt(Math.random() * 10, 0) || 0; // 中奖的值

			axios.post('http://xxxxxxxx.com/api', data)
				.then(res => {
					let {
						data
					} = res;
					if (data.result) {
						this.showCode = false;
						this.startLottery();
						this.award = Number(data.result[0].award);// 中奖的值
					} else {
						if (this.showCode) {
							alert(data.error)
						} else {
							this.showCode = true;
							this.code = '';
							alert(data.error);
						}
						
					}
				})
				.catch(error => { // 请求失败处理
					console.log(error);
				});
		}
	}
})
