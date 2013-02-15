/*
 * Copyright (c) 2013 Alex Gibson
 * Released under MIT license
 * http://alxgbsn.co.uk
 */

/*global clearInterval: false, clearTimeout: false, document: false, event: false, frames: false, history: false, Image: false, location: false, name: false, navigator: false, Option: false, parent: false, screen: false, setInterval: false, setTimeout: false, window: false, XMLHttpRequest: false, console: false */
/*global webkitNotifications: false */

(function (window, document) {
	'use strict';

	function Notify(options, display, close, click, error) {

		var i;

		this.options = {
			icon: '',
			title: 'Insert title',
			message: 'Insert message'
		};

		//User defined options for notification content
		if (typeof options === 'object') {
			for (i in options) {
				if (options.hasOwnProperty(i)) {
					this.options[i] = options[i];
				}
			}
		}

		//User defined callback when notification is displayed
		if (typeof display === 'function') {
			this.onDisplayCallback = display;
		}

		//User defined callback when notification is closed
		if (typeof close === 'function') {
			this.onCloseCallback = close;
		}

		//User defined callback when notification is clicked
		if (typeof click === 'function') {
			this.onClickCallback = click;
		}

		//User defined callback when notification is clicked
		if (typeof error === 'function') {
			this.onErrorCallback = error;
		}

		if (window.webkitNotifications) {
			this.notifications = window.webkitNotifications;
		} else if (window.Notifications) {
			this.notifications = window.Notifications;
		} else {
			console.warn('Web Notifications are not currently supported by this browser');
			return;
		}
	}

	Notify.prototype.requestPermission = function () {
		var that = this;
		this.notifications.requestPermission(function () {
			console.log(that.notifications.checkPermission());
			switch (that.notifications.checkPermission()) {
			case 0:
				that.createNotification();
				break;
			}
		});
	};

	Notify.prototype.show = function () {
		if (this.notifications.checkPermission() === 0) {
			this.createNotification();
		} else {
			this.requestPermission();
		}
	};

	Notify.prototype.createNotification = function () {
		this.myNotify = this.notifications.createNotification(this.options.icon, this.options.title, this.options.message);
		this.myNotify.addEventListener('show', this, false);
		this.myNotify.addEventListener('close', this, false);
		this.myNotify.addEventListener('click', this, false);
		this.myNotify.addEventListener('error', this, false);
		this.myNotify.show();
	};

	Notify.prototype.onDisplayNotification = function (e) {
		if (this.onDisplayCallback) {
			this.onDisplayCallback();
		}
	};

	Notify.prototype.onCloseNotification = function (e) {
		if (this.onCloseCallback) {
			this.onCloseCallback();
		}
		this.removeEvents();
	};

	Notify.prototype.onClickNotification = function (e) {
		if (this.onClickCallback) {
			this.onClickCallback();
		}
		this.removeEvents();
	};

	Notify.prototype.onErrorNotification = function (e) {
		if (this.onErrorCallback) {
			this.onErrorCallback();
		}
	};

	Notify.prototype.removeEvents = function () {
		this.myNotify.removeEventListener('show', this, false);
		this.myNotify.removeEventListener('close', this, false);
		this.myNotify.removeEventListener('click', this, false);
	};

	Notify.prototype.handleEvent = function (e) {
		switch (e.type) {
		case 'show': this.onDisplayNotification(e); break;
		case 'close': this.onCloseNotification(e); break;
		case 'click': this.onClickNotification(e); break;
		case 'error': this.onErrorNotification(e); break;
		}
	};

	//public
	window.Notify = Notify;

}(window, document));