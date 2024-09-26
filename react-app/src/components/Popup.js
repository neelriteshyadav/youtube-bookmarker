/**
 * global chrome
 *
 * @format
 */
/* eslint-disable */

import React, { useEffect, useState } from 'react';
import { getActiveTabURL } from '../utils';

const Popup = () => {
	const [bookmarks, setBookmarks] = useState([]);

	useEffect(() => {
		const loadBookmarks = async () => {
			const activeTab = await getActiveTabURL();
			const queryParameters = activeTab.url.split('?')[1];
			const urlParameters = new URLSearchParams(queryParameters);
			const currentVideo = urlParameters.get('v');

			if (activeTab.url.includes('youtube.com/watch') && currentVideo) {
				chrome.storage.sync.get([currentVideo], (data) => {
					const currentBookmarks = data[currentVideo]
						? JSON.parse(data[currentVideo])
						: [];
					setBookmarks(currentBookmarks);
				});
			}
		};

		loadBookmarks();
	}, []);

	const onPlay = async (timestamp) => {
		const activeTab = await getActiveTabURL();
		chrome.tabs.sendMessage(activeTab.id, { type: 'PLAY', value: timestamp });
	};

	const onDelete = async (timestamp) => {
		const activeTab = await getActiveTabURL();
		chrome.tabs.sendMessage(activeTab.id, { type: 'DELETE', value: timestamp });
	};

	return (
		<div className='container'>
			<div className='title'>Your bookmarks for this video</div>
			<div className='bookmarks'>
				{bookmarks.length > 0 ? (
					bookmarks.map((bookmark, idx) => (
						<div
							key={idx}
							className='bookmark'>
							<div className='bookmark-title'>{bookmark.desc}</div>
							<div className='bookmark-controls'>
								<img
									src='assets/play.png'
									onClick={() => onPlay(bookmark.time)}
									alt='Play'
								/>
								<img
									src='assets/delete.png'
									onClick={() => onDelete(bookmark.time)}
									alt='Delete'
								/>
							</div>
						</div>
					))
				) : (
					<i className='row'>No bookmarks to show</i>
				)}
			</div>
		</div>
	);
};

export default Popup;
