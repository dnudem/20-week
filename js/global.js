$(function() {
	var weekWrokData = localStorage.getItem('weekWrokData');
	if (weekWrokData) {
		setWeekWrok(JSON.parse(weekWrokData));
	} else {
		weekWrokData = [];
	}

	$("#work-item-list").sortable({
		axis: "y",
		handle: ".title",
		stop: function(e) {
			save2Storage();
		},
		revert: true
	}).disableSelection();

	$('.week-input-list .item').on('click', function() {
		var _self = $(this);
		_self.siblings('.act')
			.removeClass('act')
			.end()
			.addClass('act')
			.parents('.week-input-list')
			.siblings('.week-ipt')
			.val(_self.data('value'));
	});
	$('.work-item-list').on('click','.btn-delete', function() {
		var _self = $(this);
		var _confirm = confirm('確定要刪除嗎');
		if (_confirm) {
			_self.parents('.item').slideUp(function() {
				$(this).remove();
				save2Storage();
			})
		}
	});
	$('#btn-work-submit').on('click', function() {
		var _isEmpty = false;
		var _notNumber = false;
		var _tmp;
		$('#work-add-panel').find('input').each(function() {
			if ($.trim($(this).val()) === '') {
				_isEmpty = true;
				return false;
			}
		})
		if (_isEmpty) {
			alert('該填的填一填好嗎~~');
		} else {
			if ($('#week-begin').val() > 24 || $('#week-finish').val() > 24 || $('#week-begin').val() < 1 || $('#week-finish').val() < 1) {
				alert('一學期只有二十四週好嗎~~');
				return false;
			}
			if (parseInt($('#week-begin').val(), 10) > parseInt($('#week-finish').val(), 10)) {
				_tmp = $('#week-begin').val();
				$('#week-begin').val($('#week-finish').val());
				$('#week-finish').val(_tmp);
			}
			$('#work-item-list').append(
				'<li class="item">' +
				'	<h2 class="title">' +
				'		<span class="drag"></span>' +
				'		<span class="name">' + $('#work-title').val() + '</span>' +
				'		<button class="btn-delete">刪除</button>' +
				'	</h2>' +
				'	<p class="duration" data-week-begin="' + $('#week-begin').val() + '"data-week-finish="' + $('#week-finish').val() + '" data-week-nums="' + ($('#week-finish').val() - $('#week-begin').val() + 1) + '">' +
				//'	    第' + $('#week-begin').val() + '週到第' + $('#week-finish').val() + '週' +
				'	</p>' +
				'</li>'
			);
			$('#work-add-panel').find('input').val('');
			$('.week-input-list .item').removeClass('act')
			$('#add-panel-switch').prop('checked', false);
			save2Storage();
		}
	});

	function setWeekWrok(_data) {
		var _str = '';
		_data.forEach(function(val, idx) {
			_str += '<li class="item">' +
				'	<h2 class="title">' +
				'		<span class="drag"></span>' +
				'		<span class="name">' + val.name + '</span>' +
				'		<button class="btn-delete">刪除</button>' +
				'	</h2>' +
				'	<p class="duration" data-week-begin="' + val.weekBegin + '"data-week-finish="' + val.weekFinish + '" data-week-nums="' + val.weekNums + '">' +
				//'	    第' + val.weekBegin + '週到第' + val.weekFinish + '週' +
				'	</p>' +
				'</li>';
		})
		$('#work-item-list').html(_str);
	}

	function makeStorageData() {
		var _arr = [];
		var _obj;
		var _self;
		$('#work-item-list .item').each(function() {
			_self = $(this);
			_obj = {};
			_obj.name = _self.find('.name').html();
			_obj.weekBegin = _self.find('.duration').data('week-begin');
			_obj.weekFinish = _self.find('.duration').data('week-finish');
			_obj.weekNums = _self.find('.duration').data('week-nums');
			_arr.push(_obj);
		});
		return _arr;
	}

	function save2Storage() {
		localStorage.setItem('weekWrokData', JSON.stringify(makeStorageData()));
	}

});