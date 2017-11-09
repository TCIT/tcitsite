/*
 *
 * DrugSearch
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import makeSelectDrugSearch from './selectors';
import messages from './messages';

import Card from 'react-md/lib/Cards/Card';
import TextField from 'react-md/lib/TextFields';
import Tabs from 'react-md/lib/Tabs/Tabs';
import Tab from 'react-md/lib/Tabs/Tab';
import TabsContainer from 'react-md/lib/Tabs/TabsContainer';
import Radio from 'react-md/lib/SelectionControls/Radio';
import Button from 'react-md/lib/Buttons';
import SelectField from 'react-md/lib/SelectFields';
import Autocomplete from 'react-md/lib/Autocompletes';

import { searchService } from 'utils/search-service';

export class DrugSearch extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.handleTabChange = this.handleTabChange.bind(this);
    this.handleInlineChange = this.handleInlineChange.bind(this);
  }

  search() {
    const that = this;
    let filters = [];
    const createFilter = (searchText, rowName, filterType) => {
      filters.push({
        searchText: searchText,
        rowName: rowName,
        filterType: filterType,
      })
    };
    /* Create filters based on inputs */
    createFilter(this.state.drugName, "NOMBRE_GENERICO", "startsWithIgnoreCase");
    createFilter(this.state.drugLaboratory, "LABORATORIO", "startsWithIgnoreCase");

    /* search on the service */
    searchService("drugs", filters).then(function(results) {
      const rowName = Object.keys(results);
      /* pass results to the autocomplete component */
      if (rowName == "NOMBRE_GENERICO") {

      }

      if (rowName == "LABORATORIO") {
      }
    });

  }

  handleChangeForm(name, e) {
    if (this.state[name] != e) {
      var change = {};
      change[name] = e;
    }
  }

  handleTabChange(activeTabIndex) {
  }

  handleInlineChange(e) {
    // Basically how the `SelectionControlGroup` works
  }

  render() {
    const { activeTabIndex, inlineValue, drugsResults, filterType, drugName, drugsForm  } = this.state;
    return (
      <Card className="modal-actions md-block-centered md-grid">
        <Button
          icon
          primary
          onClick={this.props.closeAction}
          style={{float: 'right', zIndex: '999999', marginTop: '-10px'}}
        >close
        </Button>
        <h2><FormattedMessage {...messages.header} /></h2>
        <TabsContainer onTabChange={this.handleTabChange} activeTabIndex={activeTabIndex} panelClassName="md-grid" colored={false}>
        <Tabs tabId="tab">
          <Tab label="Medicamento">
            <Autocomplete
              id="drug"
              label="Medicamento"
              className="md-cell md-cell--12"
              filter={filterType}
              data={drugsResults}
              value={drugName}
              onChange={this.handleChangeForm.bind(this, 'drugName')}
              onAutocomplete={this.handleChangeForm.bind(this, 'drugName')}
            />
            <div className="md-cell md-cell--12" style={{padding: '0px', margin: '0px'}}>
              <legend className="md-subheading-1" style={{marginTop: '20px'}}>Tipo de dosis</legend>
              <Radio
                id="inlineRadio1"
                inline
                name="inlineRadios"
                value="A"
                label="Horaria"
                checked={inlineValue === 'A'}
              />
              <Radio
                id="inlineRadio2"
                inline
                name="inlineRadios"
                value="B"
                label="SOS"
                checked={inlineValue === 'B'}
              />
              <Radio
                id="inlineRadio3"
                inline
                name="inlineRadios"
                value="C"
                label="Dosis Unica"
                checked={inlineValue === 'C'}
              />
            </div>
            <TextField
              id="drug2"
              label="Laboratorio"
              placeholder="Laboratorio"
              className="md-cell md-cell--6"
              onChange={this.handleChangeForm.bind(this, 'drugLaboratory')}
            />
            <SelectField
              id="drugForm"
              label="Via"
              placeholder="Selecciona una vía"
              menuItems={drugsForm}
              className="md-cell md-cell--6"
            />
            <div className="md-cell md-cell--12" style={{marginTop: '30px'}}>
              <Button raised style={{marginRight: '20px'}}>Cancelar</Button>
              <Button raised primary>Agregar Farmaco</Button>
            </div>
          </Tab>
          <Tab label="Dilución">
            <h3 className="md-cell md-cell--12">Dilución</h3>
          </Tab>
          <Tab label="Producto no farmacologico">
            <h3 className="md-cell md-cell--12">Producto no farmacologico</h3>
          </Tab>
        </Tabs>
      </TabsContainer>
      </Card>
    );
  }
}

DrugSearch.propTypes = {
  dispatch: PropTypes.func.isRequired,
  closeAction: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  DrugSearch: makeSelectDrugSearch(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DrugSearch);
