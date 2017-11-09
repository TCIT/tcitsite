/*
 *
 * MedicineSearch
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import TextField from 'react-md/lib/TextFields';
import List from 'react-md/lib/Lists/List';
import ListItem from 'react-md/lib/Lists/ListItem';
import Avatar from 'react-md/lib/Avatars';
import FontIcon from 'react-md/lib/FontIcons';
import Button from 'react-md/lib/Buttons';
import Tabs from 'react-md/lib/Tabs/Tabs';
import Tab from 'react-md/lib/Tabs/Tab';
import TabsContainer from 'react-md/lib/Tabs/TabsContainer';
import Radio from 'react-md/lib/SelectionControls/Radio';
import SelectField from 'react-md/lib/SelectFields';
import CardActions from 'react-md/lib/Cards/CardActions';

import { drugTextToTerms } from 'utils/search-patterns'
import MedicineAdvSearchDlg from './MedicineAdvSearchDlg';
import { showMessage } from 'containers/NotificationCenter/actions';
import { addMedicine, getMedicine } from './actions';
import { makeSelectMedicineSearchResults } from './selectors';

require('!style-loader!css-loader!sass-loader!./MedicineSearch.scss');

export class MedicineSearch extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.handleTabChange = this.handleTabChange.bind(this);
    this.filterTextChanged = this.filterTextChanged.bind(this);
    this.acceptPatterns = this.acceptPatterns.bind(this);
    this.toggleDropDownResults = this.toggleDropDownResults.bind(this);
    this.toggleAdvancedSearch = this.toggleAdvancedSearch.bind(this);
    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  /* autocomplete outside clicking actions */
  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  handleClickOutside(event) {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      // close autocomplete when clicking outside of it
      this.toggleDropDownResults();
    }
  }

  filterTextChanged(e, resultsOpen, item) {
    if (resultsOpen==null)
      resultsOpen = true;

    // si la busqueda es mayor a 3 caracteres autocompletar
    if (e.length>3) {
    } else {
    }

    if (item) {
    }
  }

  filterSearch(terms){
    if(!terms) {
      terms = drugTextToTerms(this.state.filterText)
    }
    /* search through saga */
    this.props.onGetMedicine(terms);
  }

  toggleDropDownResults() {
    let newState = { resultsOpen: !this.state.resultsOpen };

    if(this.state.resultsOpen) {
      newState.searchText = '';
    }
  }

  handleTabChange(activeTabIndex) {
  }

  isEmptyObject(obj) {
    for(var prop in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, prop)) {
        return false;
      }
    }
    return true;
  }

  /* ADVANCED SEARCH */
  acceptPatterns(text, terms) {
    this.filterSearch(terms);
  }

  toggleAdvancedSearch() {
    let newState = { advancedSearchOpen: !this.state.advancedSearchOpen };
    if(!this.state.advancedSearchOpen) {
       newState.advSearchText = this.state.filterText;
    } else {
       newState.advSearchText = '';
    }
  }

  /* MEDICINE LIST AUTOCOMPLETE */
  getDrugIconClass(drugForm) {
    let drugIconClass = 'local_pharmacy';
    if(/inyectable/i.test(drugForm))
       drugIconClass = 'change_history';
    else if(/perfusi[oó]n/i.test(drugForm))
       drugIconClass = 'local_pharmacy';
    else if(/jarabe|suspenc.*oral|soluc.*oral/i.test(drugForm))
       drugIconClass = 'insert_emoticon';
    else if(/oft[aá]lmica|[oó]tica/i.test(drugForm))
       drugIconClass = 'local_offer';
    else if(/comprimido/i.test(drugForm))
       drugIconClass = 'tonality';

    return drugIconClass;
  }

  renderDrugs() {
    if (!this.props.results.medicinesResults)
      return <span>Cargando...</span>
    return this.props.results.medicinesResults.map((item, pos) => {
      return <ListItem
                key={"drug-"+pos}
                leftAvatar={<Avatar suffix="amber" icon={<FontIcon>{this.getDrugIconClass(item.itemRef.FORMA)}</FontIcon>} />}
                primaryText={item.NOMBRE_GENERICO}
                secondaryText={item.itemRef.LABORATORIO}
                onClick={() => this.filterTextChanged(item.NOMBRE_GENERICO, false, item)}
              />
    });
  }

  render() {
    const { filterType,
            // filteredDrugs,
            activeTabIndex,
            inlineValue,
            advancedSearchOpen
          } = this.state;
    return (
      <div>
        <div className="md-cell md-cell--12" style={{minHeight: '400px'}}>
          <TabsContainer onTabChange={this.handleTabChange} activeTabIndex={activeTabIndex} panelClassName="md-cell md-cell--12 action-panel" colored={false}>
            <Tabs tabId="tab">
              <Tab label="Medicamento">
                  <TextField
                  id={this.props.id}
                  type="text"
                  label="Medicamento"
                  value={this.state.filterText}
                  onChange={this.filterTextChanged}
                  rightIcon={<Button style={{ margin: '0'}} icon primary onClick={ this.toggleAdvancedSearch }>{advancedSearchOpen ? 'expand_less' : 'expand_more'}</Button>}
                />
                {this.state.resultsOpen && !this.state.advancedSearchOpen &&
                  <div ref={this.setWrapperRef}>
                    <List style={{maxHeight: '288px'}} className="md-cell md-cell--11 md-paper md-paper--1 autocomplete-list">
                      {this.renderDrugs()}
                    </List>
                  </div>
                }

                {this.state.advancedSearchOpen &&
                  <MedicineAdvSearchDlg
                    baseId={this.props.id}
                    isOpen={this.state.advancedSearchOpen}
                    popWidth={this.state.popWidth}
                    searchText={this.state.advSearchText}
                    acceptSearchPatterns={this.acceptPatterns}/>
                }
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

                <SelectField
                  id="drugForm"
                  label="Via"
                  placeholder="Selecciona una vía"
                  // menuItems={drugsForm}
                  className="md-cell md-cell--6"
                />
              </Tab>
              <Tab label="Dilución">
                  <h3 className="md-cell md-cell--12">Por desarrollar</h3>
              </Tab>
              <Tab label="Producto no farmacologico">
                  <h3 className="md-cell md-cell--12">Por desarrollar</h3>
              </Tab>
            </Tabs>
          </TabsContainer>
        </div>
        <CardActions className="md-divider-border md-divider-border--top">
          <Button flat onClick={() => this.props.closeAction()}>Cancelar</Button>
          <Button
            flat
            secondary
            disabled={ this.isEmptyObject(this.state.selectedMedicine) }
            onClick={ () => this.props.onAddMedicine(this.state.selectedMedicine) }
          >
            Guardar farmaco
          </Button>
        </CardActions>
      </div>
    );
  }
}

MedicineSearch.propTypes = {
  dispatch: PropTypes.func.isRequired,
  id: React.PropTypes.string.isRequired,  // The id of search html input is needed
  minCharsToSearch: React.PropTypes.number.isRequired, // the minimun nubre of chars to begin search
  internalSearchOnly: React.PropTypes.bool, // Only the component is going to search and filter (for cached arrays)
  addMedicine: React.PropTypes.func,
  closeAction: React.PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  results: makeSelectMedicineSearchResults(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onGetMedicine: (e) => {
      dispatch(getMedicine(e));
    },
    onAddMedicine: (item) => {
      dispatch(addMedicine(item));
      dispatch(showMessage("Un medicamento ha sido añadido"));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MedicineSearch);
