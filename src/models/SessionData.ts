export interface SessionData {
	settings: {
		searchEngines: {
			editing: Partial<{
				name: string;
				url: string;
				id: string;
				field: 'name' | 'url';
			}>;
		};
	};
}
