import React, { Component } from 'react';
import { Table } from 'reactstrap';

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
      <Table>
        <thead>
          <tr>
            <td>
              Status
            </td>
            <td>
              Distance
            </td>
            <td>
              Start Time
            </td>
            <td>
              Start City
            </td>
          </tr>
        </thead>
        <tbody>
          {
            this.props.uberHistory.history.map(item => (
              <tr>
                <td>{item.status}</td>
                <td>{item.distance}</td>
                <td>{item['start_time']}</td>
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
