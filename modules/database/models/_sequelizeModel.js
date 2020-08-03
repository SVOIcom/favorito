/**
 * Favorito Framework
 * Sequelize Model abstract
 * @author Andrey Nedobylsky (admin@twister-vl.ru)
 */

const {Sequelize, Model, DataTypes} = require('sequelize');

/**
 * @abstract
 */
class _sequelizeModel {

    /**
     * Table class name
     * @type {string}
     */
    get CLASS_NAME() {
        return '_model'
    }

    /**
     * Table name
     * @type {string}
     */
    get TABLE() {
        return '_invalid'
    }

    /**
     * Model type
     * @return {string}
     * @constructor
     */
    get TYPE() {
        return 'sequelize';
    }

    /**
     * sequelize Data types alias
     * @returns {{MediumIntegerDataTypeConstructor: MediumIntegerDataTypeConstructor, VirtualDataType: VirtualDataType, EnumDataTypeConstructor: EnumDataTypeConstructor, BlobSize: BlobSize, BlobDataTypeConstructor: BlobDataTypeConstructor, GeometryDataTypeOptions: GeometryDataTypeOptions, DecimalDataTypeOptions: DecimalDataTypeOptions, MACADDR: AbstractDataTypeConstructor, DataType: DataType, RangeDataTypeConstructor: RangeDataTypeConstructor, GEOGRAPHY: GeographyDataTypeConstructor, TIME: AbstractDataTypeConstructor, NumberDataType: NumberDataType, NumberDataTypeOptions: NumberDataTypeOptions, ArrayDataType: ArrayDataType, UUIDV4: AbstractDataTypeConstructor, CharDataTypeOptions: CharDataTypeOptions, RangeDataType: RangeDataType, DATE: DateDataTypeConstructor, ArrayDataTypeConstructor: ArrayDataTypeConstructor, DOUBLE: DoubleDataTypeConstructor, SmallIntegerDataType: SmallIntegerDataType, UUIDV1: AbstractDataTypeConstructor, FloatDataTypeOptions: FloatDataTypeOptions, RANGE: RangeDataTypeConstructor, HSTORE: AbstractDataTypeConstructor, TinyIntegerDataType: TinyIntegerDataType, BLOB: BlobDataTypeConstructor, CharDataTypeConstructor: CharDataTypeConstructor, RealDataTypeOptions: RealDataTypeOptions, DoubleDataType: DoubleDataType, VirtualDataTypeConstructor: VirtualDataTypeConstructor, DateDataTypeConstructor: DateDataTypeConstructor, TextLength: TextLength, UUID: AbstractDataTypeConstructor, StringDataTypeOptions: StringDataTypeOptions, JSON: AbstractDataTypeConstructor, EnumDataType: EnumDataType, DateOnlyDataType: DateOnlyDataType, GEOMETRY: GeometryDataTypeConstructor, DecimalDataType: DecimalDataType, DECIMAL: DecimalDataTypeConstructor, NumberDataTypeConstructor: NumberDataTypeConstructor, REAL: RealDataTypeConstructor, BlobDataTypeOptions: BlobDataTypeOptions, GeographyDataTypeOptions: GeographyDataTypeOptions, ABSTRACT: AbstractDataTypeConstructor, RealDataTypeConstructor: RealDataTypeConstructor, CharDataType: CharDataType, FloatDataType: FloatDataType, DateDataTypeOptions: DateDataTypeOptions, GeometryDataType: GeometryDataType, TinyIntegerDataTypeConstructor: TinyIntegerDataTypeConstructor, CHAR: CharDataTypeConstructor, StringDataTypeConstructor: StringDataTypeConstructor, CITEXT: AbstractDataTypeConstructor, ENUM: EnumDataTypeConstructor, NOW: AbstractDataTypeConstructor, DateDataType: DateDataType, IntegerDataTypeConstructor: IntegerDataTypeConstructor, TextDataTypeOptions: TextDataTypeOptions, StringDataType: StringDataType, INTEGER: IntegerDataTypeConstructor, GeometryDataTypeConstructor: GeometryDataTypeConstructor, RealDataType: RealDataType, MEDIUMINT: MediumIntegerDataTypeConstructor, AbstractDataTypeConstructor: AbstractDataTypeConstructor, RangeDataTypeOptions: RangeDataTypeOptions, NUMBER: NumberDataTypeConstructor, DateOnlyDataTypeConstructor: DateOnlyDataTypeConstructor, DATEONLY: DateOnlyDataTypeConstructor, DataTypeAbstract: DataTypeAbstract, AbstractDataType: AbstractDataType, BigIntDataType: BigIntDataType, DoubleDataTypeOptions: DoubleDataTypeOptions, INET: AbstractDataTypeConstructor, TextDataTypeConstructor: TextDataTypeConstructor, SMALLINT: SmallIntegerDataTypeConstructor, BOOLEAN: AbstractDataTypeConstructor, BIGINT: BigIntDataTypeConstructor, FloatDataTypeConstructor: FloatDataTypeConstructor, ArrayDataTypeOptions: ArrayDataTypeOptions, BigIntDataTypeConstructor: BigIntDataTypeConstructor, CIDR: AbstractDataTypeConstructor, TextDataType: TextDataType, MediumIntegerDataType: MediumIntegerDataType, JSONB: AbstractDataTypeConstructor, IntegerDataType: IntegerDataType, ARRAY: ArrayDataTypeConstructor, DoubleDataTypeConstructor: DoubleDataTypeConstructor, VIRTUAL: VirtualDataTypeConstructor, SmallIntegerDataTypeConstructor: SmallIntegerDataTypeConstructor, STRING: StringDataTypeConstructor, GeographyDataType: GeographyDataType, IntegerDataTypeOptions: IntegerDataTypeOptions, BlobDataType: BlobDataType, GeographyDataTypeConstructor: GeographyDataTypeConstructor, RangeableDataType: RangeableDataType, EnumDataTypeOptions: EnumDataTypeOptions, FLOAT: FloatDataTypeConstructor, DecimalDataTypeConstructor: DecimalDataTypeConstructor, TEXT: TextDataTypeConstructor, TINYINT: TinyIntegerDataTypeConstructor} | Sequelize | Model | Transaction | BelongsTo}
     * @public
     */
    get _DataTypes(){
        return DataTypes;
    }

    /**
     * Model constructor
     * @param {Sequelize} sequelize Permament database
     * @param {object} config Configure obj
     * @param {Database} parent Database object
     */
    constructor(sequelize, config = {}, parent = undefined) {
        //super({});
        this.sequelize = sequelize;
        this.config = config;
        this.parent = parent;
        this.model = Model;
    }

    /**
     * Model init
     */
    async init() {

    }

    /**
     * Initilize model
     * @param {object} fields Sequelize fields
     * @param {object} options
     * @returns {Promise<Model<any, TModelAttributes>>}
     */
    async initModel(fields, options = {}) {
        return this.model.init(fields, {...options, sequelize: this.sequelize, modelName: this.TABLE});
    }

    /**
     * Generate random id
     * @return {string}
     */
    getid() {
        return (Math.random() * (new Date().getTime())).toString(36).replace(/[^a-z]+/g, '');
    }

    /**
     * Get element from table
     * @param {number} id
     * @param {string} msg Exception message
     * @return {Promise<*>}
     */
    async get(id, msg = `id ${id} not found in ${this.TABLE}`) {
        let element = await this.model.findOne({
            where: {
                id: id
            }
        });
        if(!element) {
            this.notFoundException(msg);
        }
        return element;
    }

    /**
     * Find All records
     * @return {Promise<Array|Object>}
     */
    async all(options = {}) {
        return await this.model.findAll(options);
    }

    /**
     * findAll alias
     * @param options
     * @returns {Promise<Array|Object>}
     */
    async find(options = {}){
        return await this.all(options);
    }

    /**
     * Find one row
     * @param options
     * @returns {Promise<Sequelize>}
     */
    async findOne(options = {}){
        return await this.model.findOne(options);
    }

    /**
     * Delete record
     * @param {number} id
     * @return {Promise<number>}
     */
    async delete(id) {
        return await this.model.destroy({
            where: {
                id
            }
        });
    }

    /**
     * Not found exception
     * @param msg
     * @return {Error}
     */
    notFoundException(msg = 'Records not found') {
        return new Error(msg);
    }

    /**
     * Already exists exception
     * @param msg
     * @return {Error}
     */
    alreadyExistsException(msg = 'Records already exists') {
        return new Error(msg);
    }

    /**
     * Raw query to database
     * @param sql
     * @param options
     * @returns {Promise<[undefined, number]>}
     */
    async query(sql = '', options = {}) {
        return await this.sequelize.query(sql, options);
    }


}

module.exports = _sequelizeModel;