// A repository has a name and a constructor. The constructor is used to create
// items in the repository.
export default class Repository {
	constructor(name, constructorFunc) {
		this._name = name;
		this._templates = {};
		this._constuctor = constructorFunc;
	}

	// Define a new named template.
	define = (template) => {
		this._templates[template.name] = template;
	};

	// Create an object based on a template.
	create = (name) => {
		// Make sure there is a template with the given name.
		const template = this._templates[name];

		if (!template) {
			throw new Error("No template named '" + name + "' in repository '" +
				this._name + "'");
		}

		// Create the object, passing the template as an argument
		return new this._constuctor(template);
	};

	// Create an object based on a random template
	createRandom = () => {
		// Pick a random key and create an object based off of it.
		return this.create(Object.keys(this._templates).random());
	};
};

