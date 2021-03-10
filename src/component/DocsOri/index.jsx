import React, { Component } from "react";
import style from "./index.module.css";
import classnames from "classnames";
import icon from "./icons/iconfont.module.css";

export default class Docs extends Component {
  state = {
    text: [],
    Ast: [],
  };

  change = () => {
    this.setState({
      text: this.edit.current.innerText.split("\n"),
      Ast: markdownToAst(
        this.edit.current.innerText.split("\n"),
        this.state.text,
        this.state.Ast
      ),
    });
  };

  toolsClick = (type) => {
    return (event) => {
      let selection = document.getSelection();
      if (selection.isCollapsed) {
        event.target.blur();
        return;
      }
      let str = selection.toString();
      switch (type) {
        case "block":
          if (
            str.substring(0, 2) === "**" &&
            str.substring(str.length - 2, str.length) === "**"
          ) {
            str = str.substring(2, str.length - 2);
          } else {
            str = "**" + selection.toString() + "**";
          }
          break;
        case "xt":
          if (
            str.substring(0, 3) === "***" &&
            str.substring(str.length - 3, str.length) === "***"
          ) {
            str = str.substring(1, str.length - 1);
          } else if (
            str.substring(0, 2) === "**" &&
            str.substring(str.length - 2, str.length) === "**"
          ) {
            str = "*" + selection.toString() + "*";
          } else if (str[0] === "*" && str[str.length - 1] === "*") {
            str = str.substring(1, str.length - 1);
          } else {
            str = "*" + selection.toString() + "*";
          }
          break;
        case "h1":
        case "h2":
        case "h3":
        case "h4":
        case "h5":
        case "h6":
          const level = parseInt(type[1]);
          console.log(level);
          let range = document.createRange();
          range.setStartBefore(selection.anchorNode);
          range.setEndAfter(selection.anchorNode);
          str = (selection.anchorNode.nodeValue?selection.anchorNode.nodeValue:selection.anchorNode.innerText);
          console.log(selection.anchorNode);
          switch (level) {
            case 6:
              str = "###### " + str;
              break;
            case 5:
              str = "##### " + str;
              break;
            case 4:
              str = "#### " + str;
              break;
            case 3:
              str = "### " + str;
              break;
            case 2:
              str = "## " + str;
              break;
            case 1:
              str = "# " + str;
              break;
            default:
              break;
          }
          range.deleteContents();
          range.insertNode(document.createTextNode(str));
          this.setState({
            text: this.edit.current.innerText.split("\n"),
            Ast: markdownToAst(
              this.edit.current.innerText.split("\n"),
              this.state.text,
              this.state.Ast
            ),
          });
          console.log(event.target);
          selection.collapseToEnd();
          event.target.blur();
          this.isSelected();
          return;

        case "b1":
        case "b2":
        case "b3":
        case "b4":
        case "b5":
        case "b6":
          const blevel = parseInt(type[1]);
          console.log(blevel);
          let brange = document.createRange();
          brange.setStartBefore(selection.anchorNode);
          brange.setEndAfter(selection.anchorNode);
          str = selection.anchorNode.nodeValue;
          switch (blevel) {
            case 6:
              str = ">>>>>>> " + str;
              break;
            case 5:
              str = ">>>>> " + str;
              break;
            case 4:
              str = ">>>> " + str;
              break;
            case 3:
              str = ">>> " + str;
              break;
            case 2:
              str = ">> " + str;
              break;
            case 1:
              str = "> " + str;
              break;
            default:
              break;
          }
          brange.deleteContents();
          brange.insertNode(document.createTextNode(str));
          this.setState({
            text: this.edit.current.innerText.split("\n"),
            Ast: markdownToAst(
              this.edit.current.innerText.split("\n"),
              this.state.text,
              this.state.Ast
            ),
          });
          event.target.blur();
          this.isSelected();
          return;

        default:
          str = selection.toString;
          break;
      }

      let range = selection.getRangeAt(0);
      range.deleteContents();
      range.insertNode(document.createTextNode(str));
      this.setState({
        text: this.edit.current.innerText.split("\n"),
        Ast: markdownToAst(
          this.edit.current.innerText.split("\n"),
          this.state.text,
          this.state.Ast
        ),
      });
      event.target.blur();
      this.isSelected();
    };
  };

  isSelected = () => {
    if (document.getSelection().isCollapsed) {
      this.bold.current.className = classnames(
        icon.iconfont,
        icon.iconBold,
        style.toolsButton
      );
      this.xt.current.className = classnames(
        icon.iconfont,
        icon.iconXieti,
        style.toolsButton
      );
      return;
    } else {
      const str = document.getSelection().toString();
      if (
        str.substring(0, 3) === "***" &&
        str.substring(str.length - 3, str.length) === "***"
      ) {
        this.bold.current.className = classnames(
          icon.iconfont,
          icon.iconJiacuxuanzhong,
          style.toolsButton
        );
        this.xt.current.className = classnames(
          icon.iconfont,
          icon.iconXietixuanzhong,
          style.toolsButton
        );
      } else if (
        str.substring(0, 2) === "**" &&
        str.substring(str.length - 2, str.length) === "**"
      ) {
        this.bold.current.className = classnames(
          icon.iconfont,
          icon.iconJiacuxuanzhong,
          style.toolsButton
        );
        this.xt.current.className = classnames(
          icon.iconfont,
          icon.iconXieti,
          style.toolsButton
        );
      } else if (str[0] === "*" && str[str.length - 1] === "*") {
        this.xt.current.className = classnames(
          icon.iconfont,
          icon.iconXietixuanzhong,
          style.toolsButton
        );
        this.bold.current.className = classnames(
          icon.iconfont,
          icon.iconBold,
          style.toolsButton
        );
      } else {
        this.bold.current.className = classnames(
          icon.iconfont,
          icon.iconBold,
          style.toolsButton
        );
        this.xt.current.className = classnames(
          icon.iconfont,
          icon.iconXieti,
          style.toolsButton
        );
      }
    }
  };

  headerIn = () => {
    this.headerList.current.style.display = "block";
  };

  headerOut = () => {
    this.headerList.current.style.display = "none";
  };


  edit = React.createRef();
  bold = React.createRef();
  xt = React.createRef();
  headerList = React.createRef();
  blockList = React.createRef();

  render() {
    return (
      <div className={style.outerBlock}>
        <div className={style.toolsBlock}>
          <span></span>

          <div
            className={style.outHeader}
            onMouseEnter={this.headerIn}
            onMouseLeave={this.headerOut}
          >
            <button
              className={classnames(
                icon.iconfont,
                icon.iconH,
                style.toolsButton
              )}
            ></button>
            <div ref={this.headerList} className={style.headerHover}>
              <button
                className={classnames(
                  icon.iconfont,
                  icon.iconH1,
                  style.buttonHeader
                )}
                onClick={this.toolsClick("h1")}
              ></button>
              <br />
              <button
                className={classnames(
                  icon.iconfont,
                  icon.iconH2,
                  style.buttonHeader
                )}
                onClick={this.toolsClick("h2")}
              ></button>
              <br />
              <button
                className={classnames(
                  icon.iconfont,
                  icon.iconH3,
                  style.buttonHeader
                )}
                onClick={this.toolsClick("h3")}
              ></button>
              <br />
              <button
                className={classnames(
                  icon.iconfont,
                  icon.iconH4,
                  style.buttonHeader
                )}
                onClick={this.toolsClick("h4")}
              ></button>
              <br />
              <button
                className={classnames(
                  icon.iconfont,
                  icon.iconH5,
                  style.buttonHeader
                )}
                onClick={this.toolsClick("h5")}
              ></button>
              <br />
              <button
                className={classnames(
                  icon.iconfont,
                  icon.iconH6,
                  style.buttonHeader
                )}
                onClick={this.toolsClick("h6")}
              ></button>
              <br />
            </div>
          </div>

          <button
            ref={this.bold}
            className={classnames(
              icon.iconfont,
              icon.iconBold,
              style.toolsButton
            )}
            onClick={this.toolsClick("block")}
          ></button>
          <button
            ref={this.xt}
            className={classnames(
              icon.iconfont,
              icon.iconXieti,
              style.toolsButton
            )}
            onClick={this.toolsClick("xt")}
          ></button>
        </div>
        <div
          className={style.innerBlock}
          ref={this.edit}
          contentEditable
          onInput={this.change}
          onMouseUp={this.isSelected}
        ></div>
        <div className={style.innerBlock}>
          {this.state.Ast.map((item,index) => {
            return AstToDom(item,index);
          })}
        </div>
      </div>
    );
  }
}

function markdownToAst(text, preText, preAst) {
  let Asts = [];
  let astc = 0;
  for (let i = 0; i < text.length; i++) {
    //diffing算法
    if (preAst.length > astc) {
      if (preAst[astc].type === "uList") {
        let update = false;
        for (let list = 0; list < preAst[astc].offset; list++) {
          if (text[i + list] !== preText[i + list]) {
            update = true;
            break;
          }
        }
        if (
          !update &&
          (text[i + preAst[astc].offset][0] === "*" ||
            text[i + preAst[astc].offset][0] === "-" ||
            text[i + preAst[astc].offset][0] === "+") &&
          (text[i + preAst[astc].offset][1] === " " ||
            text[i + preAst[astc].offset][1] === " ")
        ) {
          update = true;
        }

        astc++;
        if (!update) {
          Asts.push(preAst[astc - 1]);
          i += preAst[astc - 1].offset - 1;
          console.log("list not update");
          continue;
        }
      } else {
        astc++;
        if (text[i] === preText[i]) {
          Asts.push(preAst[astc - 1]);
          console.log("node not update");
          continue;
        }
      }
    } else {
      if (text[i] === preText[i]) {
        console.log("node not update");
        continue;
      }
    }

    const str = text[i];
    let ast = {
      type: "",
      line: i,
      offset: str.length,
      children: [],
    };

    //确定外部类型
    if (str[0] === "#") {
      let count = 1;

      for (let h = 1; h < str.length; h++) {
        if (str[h] !== "#") {
          if (str[h] === " " || str[h] === " ") {
            ast.type = "header";
            ast.level = count > 6 ? 6 : count;
            ast.children = substrToChildren(str.substring(count + 1), "***");
          } else {
            ast.type = "texts";
            ast.children = substrToChildren(str, "***");
          }
          //分析内部
          break;
        }
        count++;
      }
    } else if (str[0] === ">") {
      let count = 1;

      for (let h = 1; h < str.length; h++) {
        if (str[h] !== ">") {
          if (str[h] === " " || str[h] === " ") {
            if (str.substring(count + 1)[0] === "#") {
              let count_i = 1;
              let str_i = str.substring(count + 1);
              for (let h_i = 1; h_i < str_i.length; h_i++) {
                if (str_i[h_i] !== "#") {
                  if (str_i[h_i] === " " || str_i[h_i] === " ") {
                    ast.type = "header&block";
                    ast.h_level = count_i > 6 ? 6 : count_i;
                    ast.b_level = count > 6 ? 6 : count;
                    ast.children = substrToChildren(
                      str_i.substring(count_i + 1),
                      "***"
                    );
                  } else {
                    ast.type = "block";
                    ast.level = count > 6 ? 6 : count;
                    ast.children = substrToChildren(str_i, "***");
                  }
                  //分析内部
                  break;
                }
                count_i++;
              }
            } else {
              ast.type = "block";
              ast.level = count > 6 ? 6 : count;
              ast.children = substrToChildren(str.substring(count + 1), "***");
            }
          } else {
            ast.type = "texts";
            ast.children = substrToChildren(str, "***");
          }
          //分析内部

          break;
        }
        count++;
      }
    } else if (
      (str[0] === "*" || str[0] === "-" || str[0] === "+") &&
      (str[1] === " " || str[1] === " ")
    ) {
      let offsetLine = 0;
      for (let list = i; list < text.length; list++) {
        if (
          (text[list][0] === "*" ||
            text[list][0] === "-" ||
            text[list][0] === "+") &&
          (text[list][1] === " " || text[list][1] === " ")
        ) {
          offsetLine++;
          let child = {
            line: list,
            offset: text[list].length - 2,
            children: substrToChildren(text[list].substring(2), "***"),
          };
          ast.children.push(child);
        } else {
          break;
        }
      }
      ast.type = "uList";
      ast.offset = offsetLine;
      i += offsetLine - 1;
    } else {
      ast.type = "texts";
      ast.children = substrToChildren(str, "***");
    }

    Asts.push(ast);
  }
  return Asts;
}

function substrToChildren(str, sp) {
  let children = [];

  let space = true;

  if (sp.length === 0) {
    children.push({
      type: "text",
      value: str,
    });
    return children;
  }
  if (str.split(sp).length >= 3) {
    const tep = str.split(sp);
    if (tep[0].length > 0) {
      substrToChildren(tep[0], sp.substring(1)).forEach((item) => {
        children.push(item);
      });
    }
    for (let i = 1; i < tep.length - 1; i++) {
      if (tep[i].length > 0) {
        if (space) {
          switch (sp) {
            case "***":
              children.push({
                type: "strong&em",
                value: tep[i],
              });
              break;
            case "**":
              children.push({
                type: "strong",
                value: tep[i],
              });
              break;
            case "*":
              children.push({
                type: "em",
                value: tep[i],
              });
              break;
            default:
              children.push({
                type: "text",
                value: tep[i],
              });
              break;
          }
        } else {
          substrToChildren(tep[i], sp.substring(1)).forEach((item) => {
            children.push(item);
          });
        }
        space = !space;
      } else {
        children.push({
          type: "text",
          value: sp + sp,
        });
      }
    }
    if (tep[tep.length - 1].length > 0) {
      substrToChildren(tep[tep.length - 1], sp.substring(1)).forEach((item) => {
        children.push(item);
      });
    }
  } else {
    substrToChildren(str, sp.substring(1)).forEach((item) => {
      children.push(item);
    });
  }

  return children;
}

function AstToDom(item,index) {
  if (item.type === "header") {
    return (
      <p key={'header'+index} className={headerLevel(item.level)}>
        {item.children.map((child) => {
          return childToDom(child);
        })}
      </p>
    );
  } else if (item.type === "block") {
    return (
      <p key={'block'+index} className={blockLevel(item.level)}>
        {item.children.map((child) => {
          return childToDom(child);
        })}
      </p>
    );
  } else if (item.type === "header&block") {
    return (
      <p
      key={'header&block'+index}
        className={classnames(
          blockLevel(item.b_level),
          headerLevel(item.h_level)
        )}
      >
        {item.children.map((child) => {
          return childToDom(child);
        })}
      </p>
    );
  } else if (item.type === "uList") {
    return (
      <ul key={'ul'+index}>
        {item.children.map((child) => {
          return (
            <li>
              {child.children.map((listChild) => {
                return childToDom(listChild);
              })}
            </li>
          );
        })}
      </ul>
    );
  } else {
    return (
      <p key={'text'+index}>
        {item.children.map((child) => {
          return childToDom(child);
        })}
      </p>
    );
  }
}

function childToDom(child) {
  if (child.type === "strong") {
    return <strong>{child.value}</strong>;
  } else if (child.type === "em") {
    return <em>{child.value}</em>;
  } else if (child.type === "strong&em") {
    return (
      <strong>
        <em>{child.value}</em>
      </strong>
    );
  } else {
    return <span>{child.value}</span>;
  }
}

function blockLevel(level) {
  switch (level) {
    case 1:
      return style.block_1;
    case 2:
      return style.block_2;
    case 3:
      return style.block_3;
    case 4:
      return style.block_4;
    case 5:
      return style.block_5;
    case 6:
      return style.block_6;
    default:
      break;
  }
}

function headerLevel(level) {
  switch (level) {
    case 1:
      return style.header_1;
    case 2:
      return style.header_2;
    case 3:
      return style.header_3;
    case 4:
      return style.header_4;
    case 5:
      return style.header_5;
    case 6:
      return style.header_6;
    default:
      break;
  }
}
