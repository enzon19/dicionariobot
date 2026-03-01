export interface SessionData {
	settings: {
		searchEngines: {
			editing: {
				name: string;
				field: 'name' | 'url';
			};
		};
	};
}
