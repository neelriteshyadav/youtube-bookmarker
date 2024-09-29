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
		<div className='p-6 w-72 bg-gray-100 rounded-lg shadow-lg container'>
			<div className='text-lg font-bold mb-4 text-gray-700 title'>
				Your bookmarks for this video
			</div>
			<div className='space-y-4 bookmarks rounded-lg'>
				{bookmarks.length > 0 ? (
					bookmarks.map((bookmark, idx) => (
						<div
							key={idx}
							className='flex items-center justify-between bg-white p-3 rounded-lg shadow bookmarks'>
							<div className='text-sm font-medium text-gray-700'>
								{bookmark.desc}
							</div>
							<div className='flex space-x-2'>
								<img
									src='assets/play.png'
									onClick={() => onPlay(bookmark.time)}
									className='w-6 h-6 cursor-pointer'
									alt='Play'
								/>
								<img
									src='assets/delete.png'
									onClick={() => onDelete(bookmark.time)}
									className='w-6 h-6 cursor-pointer'
									alt='Delete'
								/>
							</div>
						</div>
					))
				) : (
					<i className='block text-center text-gray-500 row pb-4'>
						No bookmarks to show
					</i>
				)}
			</div>
		</div>
	);
};

export default Popup;
