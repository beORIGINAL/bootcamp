import './songs-queue.jade';
import './songs-queue.scss';
import logo from '../../../assets/media/images/logo.png';

class songsQueueController {
	/*@ngInject*/
	constructor($q, SongsQueueFactory, ReservationsFactory){
		this.$q = $q;
		this.logo = logo;
		this.SongsQueueFactory = SongsQueueFactory;
		this.ReservationsFactory = ReservationsFactory;
		this.tablesWhoReserve = [];
		this.songsQueueList = [];
	}

	$onInit () {
		this.getData().then(() => {
				this.timing = setInterval(this.getData.bind(this) , 10000);
			})
	}
	
	$onDestroy () {
		clearInterval(this.timing);
	}

	getData () {
		return this.$q.all([
			this.ReservationsFactory.getAllReservations()
				.then((result) => {
					this.tablesWhoReserve = result;
				}),
			this.SongsQueueFactory.getSongsQueueList()
				.then((data) => {
					this.songsQueueList = data;
				})
		]);
	}

	updateSongStatus (song) {
		song.isPlayed = true;
		this.SongsQueueFactory.updateSongStatus(song)
			.then((data) => {
				console.log('Do smth after update');
			});
	}

	toggleTableState (table) {
		table.isActive = false;
		this.ReservationsFactory.updateReservationStatus(table)
			.then((data) => {
				console.log('Do smth after update');
			})
	}
}

export default {
	templateUrl: 'songs-queue.jade',
	controller: songsQueueController
}