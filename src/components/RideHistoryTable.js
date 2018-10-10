import React, { Component } from 'react';
import { Table } from 'reactstrap';
import moment from 'moment';

class RideHistoryTable extends Component {
  render() {
    if (!this.props.uberHistory) {
      return (
        <div>
          No uber history available.
        </div>
      )
    }
    return (
      <Table striped>
        <thead>
          <tr>
            <th>
              Status
            </th>
            <th>
              Distance
            </th>
            <th>
              Date
            </th>
            <th>
              Time
            </th>
            <th>
              City
            </th>
          </tr>
        </thead>
        <tbody>
          {
            this.props.uberHistory.history.map(item => (
              <tr key={item['request_id']}>
                <td>{item.status.charAt(0).toUpperCase() + item.status.slice(1)}</td>
                <td>{(item.distance + '').substring(0, 4) + ' '} miles</td>
                <td>{moment(item['start_time'] * 1000).format('MMMM Do YYYY')}</td>
                <td>{moment(item['start_time'] * 1000).format('h:mm a')}</td>
                <td>{item['start_city']['display_name']}</td>
              </tr>
            ))
          }
        </tbody>
      </Table>
    )
  }
}

export default RideHistoryTable;
