import React, { PureComponent } from 'react'
import 'whatwg-fetch'
import { Alert } from 'react-bootstrap'
import {DEFAULT_COLLECTION} from '../../constants/queryConstants'

export default class ShowToolsCount extends PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      databaseCount: 0,
      otherToolsCounts: 0,
      loadingToolsCount: true,
    }
  }

  componentDidMount () {
    const collection = this.props.collection || DEFAULT_COLLECTION

    let databaseCount = 0

    fetch(`https://bio.tools/api/tool/?collectionID=${collection}&q="database-portal"`)
      .then(response => response.json())
      .then(data => {
        databaseCount = data.count
      })
      .then(fetch(`https://bio.tools/api/tool/?collectionID=${collection}`)
        .then(response => response.json())
        .then(data => {
          this.setState({
            databaseCount: databaseCount,
            otherToolsCount: data.count - databaseCount,
            loadingToolsCount: false,
          })
        }))
  }

  render () {
    const { databaseCount, otherToolsCount, loadingToolsCount } = this.state

    if (loadingToolsCount) {
      return <div />
    }

    return (
      <div>
        {databaseCount && otherToolsCount
          ? <Alert bsStyle='success'>
            There are <strong>{databaseCount}</strong> databases and <strong>{otherToolsCount}</strong> other tools
            available
          </Alert>
          : <Alert bsStyle='danger'>We are sorry, but there are no services.</Alert>}
      </div>
    )
  }
}
