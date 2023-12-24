import React from "react";

export default class TagPage extends React.Component {

  constructor(props) {
    super(props);

    this.display_main_page = this.display_main_page.bind(this);
    //this.display_tag_content = this.display_tag_content.bind(this);

  }

  display_main_page(_tid, is_tag) {
    this.props.main_question_page(_tid, is_tag);

  }

  make_tag_row(tag, tag_count, position) {
    if (tag_count === 1) {
      return (
        <div className="tag_box" id={position} key={tag._id}>
          <p className="tag_name" style={{ margin: 0 }} onClick={
            (e) => {
              e.preventDefault();
              this.display_main_page(tag._id, true);
            }
          }>{tag.name} </p>
          <p id="time_tag_used" style={{ margin: 0 }}>{tag_count} question</p>
        </div>
      );
    }
    else {
      return (
        <div className="tag_box" id={position} key={tag._id}>
          <p className="tag_name" style={{ margin: 0 }} onClick={
            (e) => {
              e.preventDefault();
              this.display_main_page(tag._id, true);
            }
          }>{tag.name} </p>
          <p id="time_tag_used" style={{ margin: 0 }}>{tag_count} questions</p>
        </div>
      );
    }

  }


  render() {
    var tag_row = [];
    var quest_data = this.props.data.questions;
    var tags_data = this.props.data.tags;

    tags_data.forEach((a, i) => {

      let tag_count = 0;

      if (i % 3 === 0) {
        quest_data.forEach(element => {
          element.tags.forEach(t => {
            if (t === a._id) tag_count++;
          })
        });

        tag_row.push(this.make_tag_row(a, tag_count, "tag_content_left"));



      }
      else if (i % 3 === 1) {
        quest_data.forEach(element => {
          element.tags.forEach(t => {
            if (t === a._id) tag_count++;
          })
        });

        tag_row.push(this.make_tag_row(a, tag_count, "tag_content_middle"));

      }
      else {
        quest_data.forEach(element => {
          element.tags.forEach(t => {
            if (t === a._id) tag_count++;
          })
        });

        tag_row.push(this.make_tag_row(a, tag_count, "tag_content_right"));

      }
    })

    // console.log("inside actual Tag_page class");
    // console.log(tag_row);
    // console.log(this.props);
    return (
      <div id="main_right">
        <div id="tag_page">
          <div id="tag_headers">
            <h1 id="num_tags">{this.props.data.tags.length} Tags</h1>
            <h1 id="all_tags">All Tags</h1>
            <button className="askQ" id='askQ_tag' onClick={() => {
              if (this.props.username === "") {
                alert("You should login for asking the question");
              }
              else {
                this.props.ask_question();
              }
            }}>Ask Question</button>
          </div>
          <div id="tags_area">
            {tag_row}
          </div>
        </div>
      </div>
    );
  }
}