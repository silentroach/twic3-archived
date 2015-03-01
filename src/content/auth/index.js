import './index.styl';

import i18n from '../../i18n';
import Message from '../../message';

const CLASSNAME = 'twic';

var pinWrapperElement = document.querySelector('#oauth_pin');
var pinElement;
var resultElement;
var msg;

function changeResultText() {
	resultElement.innerText = i18n.translate.apply(i18n, arguments);
}

if (pinWrapperElement) {
	pinElement = pinWrapperElement.querySelector('code');

	if (pinElement) {
		msg = new Message(Message.TYPE_AUTH_CHECK);

		msg
			.send()
			.then(function(result) {
				if (!result) {
					return;
				}

				document.body.classList.add(CLASSNAME);

				resultElement = document.createElement('p');
				resultElement.classList.add(CLASSNAME);
				changeResultText('content.auth.progress');

				pinWrapperElement.appendChild(resultElement);

				msg = new Message(Message.TYPE_AUTH, {
					pin: pinElement.innerText
				});

				msg
					.send()
					.then(function(result) {
						if (!result) {
							changeResultText('content.auth.error');
						} else {
							changeResultText('content.auth.success', result.name);
						}
					});
			});
	}
}
