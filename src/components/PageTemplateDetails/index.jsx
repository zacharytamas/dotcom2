import React from 'react';
import Sidebar from '../Sidebar';
import './style.scss';

class PageTemplateDetails extends React.Component {
  render() {
    const page = this.props.data.markdownRemark;

    return (
      <div>
        <Sidebar {...this.props} />
        <div className="content">
          <div className="content__inner">
            <div className="page">
              <h1 className="page__title">{page.frontmatter.title}</h1>
              {!page.frontmatter.disableTableOfContents &&
              page.tableOfContents ? (
                <div
                  className="page__toc"
                  dangerouslySetInnerHTML={{
                    __html: page.tableOfContents
                  }}
                />
              ) : null}

              <div
                className="page__body"
                dangerouslySetInnerHTML={{ __html: page.html }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default PageTemplateDetails;
