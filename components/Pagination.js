import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classnames from 'classnames';
import Icon from './Icon';
import Select from './Select';
import SelectItem from './SelectItem';
import TextInput from './TextInput';
import { equals } from '../lib/array';

class Pagination extends Component {
  static propTypes = {
    backwardText: PropTypes.string,
    className: PropTypes.string,
    itemRangeText: PropTypes.func,
    forwardText: PropTypes.string,
    itemsPerPageText: PropTypes.string,
    itemText: PropTypes.func,
    onChange: PropTypes.func,
    pageNumberText: PropTypes.string,
    pageRangeText: PropTypes.func,
    pageText: PropTypes.func,
    pageSizes: PropTypes.arrayOf(PropTypes.number).isRequired,
    totalItems: PropTypes.number,
    disabled: PropTypes.bool,
    page: PropTypes.number,
    pageSize: PropTypes.number,
    pagesUnknown: PropTypes.bool,
    isLastPage: PropTypes.bool,
    pageInputDisabled: PropTypes.bool
  };
  static defaultProps = {
    backwardText: 'Backward',
    itemRangeText: (min, max, total) => `${min}-${max} of ${total} items`,
    forwardText: 'Forward',
    itemsPerPageText: 'items per page',
    onChange: () => {},
    pageNumberText: 'Page Number',
    pageRangeText: (current, total) => `${current} of ${total} pages`,
    disabled: false,
    page: 1,
    pagesUnknown: false,
    isLastPage: false,
    pageInputDisabled: false,
    itemText: (min, max) => `${min}-${max} items`,
    pageText: page => `page ${page}`
  };
  static uuid = 0;
  state = {
    page: this.props.page,
    pageSize:
      this.props.pageSize && this.props.pageSizes.includes(this.props.pageSize)
        ? this.props.pageSize
        : this.props.pageSizes[0]
  };
  componentWillReceiveProps({ pageSizes, page, pageSize }) {
    if (!equals(pageSizes, this.props.pageSizes)) {
      this.setState({ pageSize: pageSizes[0], page: 1 });
    }
    if (page !== this.props.page) {
      this.setState({
        page
      });
    }
    if (pageSize !== this.props.pageSize) {
      this.setState({ pageSize });
    }
  }
  id = Pagination.uuid++;
  handleSizeChange = evt => {
    const pageSize = Number(evt.target.value);
    this.setState({ pageSize, page: 1 });
    this.props.onChange({ page: 1, pageSize });
  };
  handlePageInputChange = evt => {
    const page = Number(evt.target.value);
    if (
      page > 0 &&
      page <= Math.ceil(this.props.totalItems / this.state.pageSize)
    ) {
      this.setState({ page });
      this.props.onChange({ page, pageSize: this.state.pageSize });
    }
  };
  incrementPage = () => {
    const page = this.state.page + 1;
    this.setState({ page });
    this.props.onChange({ page, pageSize: this.state.pageSize });
  };
  decrementPage = () => {
    const page = this.state.page - 1;
    this.setState({ page });
    this.props.onChange({ page, pageSize: this.state.pageSize });
  };
  render() {
    const {
      backwardText,
      className,
      forwardText,
      isLastPage,
      itemRangeText,
      itemsPerPageText,
      itemText,
      onChange, // eslint-disable-line no-unused-vars
      page: pageNumber, // eslint-disable-line no-unused-vars
      pageInputDisabled,
      pageNumberText,
      pageRangeText,
      pageSize, // eslint-disable-line no-unused-vars
      pageSizes,
      pagesUnknown,
      pageText,
      totalItems,
      ...other
    } = this.props;

    const classNames = classnames('bx--pagination', className);

    return (
      <div className={classNames} {...other}>
        <div className="bx--pagination__left">
          <Select
            id={`bx-pagination-select-${this.id}`}
            labelText={itemsPerPageText}
            hideLabel
            onChange={this.handleSizeChange}
            value={this.state.pageSize}
          >
            {pageSizes.map(size =>
              <SelectItem key={size} value={size} text={String(size)} />
            )}
          </Select>
          <span className="bx--pagination__text">
            {itemsPerPageText}&nbsp;&nbsp;|&nbsp;&nbsp;
          </span>
          <span className="bx--pagination__text">
            {pagesUnknown
              ? itemText(
                  this.state.pageSize * (this.state.page - 1) + 1,
                  this.state.page * this.state.pageSize
                )
              : itemRangeText(
                  this.state.pageSize * (this.state.page - 1) + 1,
                  Math.min(this.state.page * this.state.pageSize, totalItems),
                  totalItems
                )}
          </span>
        </div>
        <div className="bx--pagination__right">
          <span className="bx--pagination__text">
            {pagesUnknown
              ? pageText(this.state.page)
              : pageRangeText(
                  this.state.page,
                  Math.ceil(totalItems / this.state.pageSize)
                )}
          </span>
          <button
            className="bx--pagination__button bx--pagination__button--backward"
            onClick={this.decrementPage}
            disabled={this.props.disabled || this.state.page === 1}
          >
            <Icon
              className="bx--pagination__button-icon"
              name="chevron--left"
              description={backwardText}
            />
          </button>
          {pageInputDisabled
            ? <span className="bx--pagination__text">|</span>
            : <TextInput
                id={`bx-pagination-input-${this.id}`}
                placeholder="0"
                value={this.state.page}
                onChange={this.handlePageInputChange}
                labelText={pageNumberText}
                hideLabel
              />}
          <button
            className="bx--pagination__button bx--pagination__button--forward"
            onClick={this.incrementPage}
            disabled={
              this.props.disabled ||
              this.state.page === Math.ceil(totalItems / this.state.pageSize) ||
              isLastPage
            }
          >
            <Icon
              className="bx--pagination__button-icon"
              name="chevron--right"
              description={forwardText}
            />
          </button>
        </div>
      </div>
    );
  }
}

export default Pagination;
