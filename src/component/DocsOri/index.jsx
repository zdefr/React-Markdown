import React, { Component } from 'react'
import style from './index.module.css'

export default class Docs extends Component {
    state = {
        text: [],
        Ast: []
    }

    change = () => {
        this.setState({
            text: this.edit.current.innerText.split('\n'),
            Ast: markdownToAst(this.edit.current.innerText.split('\n'), this.state.text, this.state.Ast)
        })
    }

    edit = React.createRef();

    render() {
        return (
            <div>
                <div className={style.ori_markdown} ref={this.edit} contentEditable onInput={this.change}>
                </div>
                <div className={style.des_markdown}>
                    {
                        this.state.Ast.map((item)=>{
                            return AstToDom(item);
                        })
                    }
                </div>
            </div>

        )
    }
}

function markdownToAst(text, preText, preAst) {
    let Asts = [];
    let astc = 0;
    for (let i = 0; i < text.length; i++) {


        //diffing算法
        if (preAst.length > astc) {
            if (preAst[astc].type === 'uList') {
                let update = false;
                for (let list = 0; list < preAst[astc].offset; list++) {
                    if (text[i + list] !== preText[i + list]) {
                        update = true;
                        break;
                    }
                }
                console.log('i:', i);
                console.log('astc:', astc);
                console.log(i + preAst[astc].offset);
                if ((!update) && (text[i + preAst[astc].offset][0] === '*' || text[i + preAst[astc].offset][0] === '-' || text[i + preAst[astc].offset][0] === '+')
                    && (text[i + preAst[astc].offset][1] === ' ' || text[i + preAst[astc].offset][1] === ' ')) {
                    update = true;
                }

                astc++;
                if (!update) {
                    Asts.push(preAst[astc - 1]);
                    i += (preAst[astc - 1].offset - 1);
                    console.log('list not update');
                    continue;
                }
            } else {
                astc++;
                if (text[i] === preText[i]) {
                    Asts.push(preAst[astc - 1]);
                    console.log('node not update');
                    continue;
                }
            }

        } else {
            if (text[i] === preText[i]) {
                console.log('node not update');
                continue;
            }
        }

        const str = text[i]
        let ast = {
            type: '',
            line: i,
            offset: str.length,
            children: [],
        };

        //确定外部类型
        if (str[0] === '#') {
            let count = 1;

            for (let h = 1; h < str.length; h++) {
                if (str[h] !== '#') {
                    if (str[h] === ' ' || str[h] === ' ') {
                        ast.type = 'header';
                        ast.level = (count > 6 ? 6 : count);
                        ast.children = substrToChildren(str.substring(count));
                    } else {
                        ast.type = 'texts';
                        ast.children = substrToChildren(str);
                    }
                    //分析内部
                    break;
                }
                count++;
            }
        } else if (str[0] === '>') {
            let count = 1;

            for (let h = 1; h < str.length; h++) {
                if (str[h] !== '>') {
                    if (str[h] === ' ' || str[h] === ' ') {
                        ast.type = 'block';
                        ast.level = (count > 6 ? 6 : count);
                        ast.children = substrToChildren(str.substring(count));
                    } else {
                        ast.type = 'texts';
                        ast.children = substrToChildren(str);
                    }
                    //分析内部

                    break;
                }
                count++;
            }
        } else if ((str[0] === '*' || str[0] === '-' || str[0] === '+') && (str[1] === ' ' || str[1] === ' ')) {
            let offsetLine = 0;
            for (let list = i; list < text.length; list++) {
                if ((text[list][0] === '*' || text[list][0] === '-' || text[list][0] === '+') && (text[list][1] === ' ' || text[list][1] === ' ')) {
                    offsetLine++;
                    let child = {
                        line: list,
                        offset: text[list].length - 2,
                        value: text[list].substring(2)
                    }
                    ast.children.push(child);
                } else {
                    break;
                }
            }
            ast.type = 'uList';
            ast.offset = offsetLine;
            i += (offsetLine - 1);
        }else{
            ast.type = 'texts';
            ast.children = substrToChildren(str);
        }

        Asts.push(ast);
    }
    console.log(Asts);
    return Asts;
}

function substrToChildren(str) {
    let children = [];

    let space = true;
    if (str.split('***').length >= 3) {
        const tep = str.split('***');
        if (tep[0].length > 0) {
            spl_s(tep[0]).forEach((item)=>{
                children.push(item);
            })
        }
        for (let i = 1; i < (tep.length - 1); i++) {
            if (tep[i].length > 0) {
                if (space) {
                    children.push({
                        type: 'strong&em',
                        value: tep[i]
                    })
                } else {
                    spl_s(tep[i]).forEach((item)=>{
                        children.push(item);
                    })
                }
                space = !space;
            } else {
                children.push({
                    type: 'text',
                    value: '******'
                })
            }
        }
        if (tep[tep.length - 1].length > 0) {
            spl_s(tep[tep.length - 1]).forEach((item)=>{
                children.push(item);
            })
        }
    } else {
        spl_s(str).forEach((item)=>{
            children.push(item);
        })
    }

    return children;
}

function spl_s(str) {
    let children = [];

    let space = true;
    if (str.split('**').length >= 3) {
        const tep = str.split('**');
        if (tep[0].length > 0) {
            spl_e(tep[0]).forEach((item)=>{
                children.push(item);
            })
        }
        for (let i = 1; i < (tep.length - 1); i++) {
            if (tep[i].length > 0) {
                if (space) {
                    children.push({
                        type: 'strong',
                        value: tep[i]
                    })
                } else {
                    spl_e(tep[i]).forEach((item)=>{
                        children.push(item);
                    })
                }
                space = !space;
            } else {
                children.push({
                    type: 'text',
                    value: '****'
                })
            }
        }
        if (tep[tep.length - 1].length > 0) {
            spl_e(tep[tep.length - 1]).forEach((item)=>{
                children.push(item);
            })
        }
    } else {
        spl_e(str).forEach((item)=>{
            children.push(item);
        })
    }

    return children;
}

function spl_e(str) {
    let children = [];

    let space = true;
    if (str.split('*').length >= 3) {
        const tep = str.split('*');
        if (tep[0].length > 0) {
            children.push({
                type: 'text',
                value: tep[0]
            })
        }
        for (let i = 1; i < (tep.length - 1); i++) {
            if (tep[i].length > 0) {
                if (space) {
                    children.push({
                        type: 'em',
                        value: tep[i]
                    })
                } else {
                    children.push({
                        type: 'text',
                        value: tep[i]
                    })
                }
                space = !space;
            } else {
                children.push({
                    type: 'text',
                    value: '**'
                })
            }
        }
        if (tep[tep.length - 1].length > 0) {
            children.push({
                type: 'text',
                value: tep[tep.length - 1]
            })
        }
    } else {
        console.log(str);
        children.push({
            type: 'text',
            value: str
        })
    }

    return children;
}

function AstToDom(item){
    if(item.type === 'header'){
        return (
            <h1>
                {
                    item.children.map((child)=>{
                        return childToDom(child);
                    })
                }
            </h1>
        );
    }else{
        return (
            <p>
                {
                    item.children.map((child)=>{
                        return childToDom(child);
                    })
                }
            </p>
        );
    }
}

function childToDom(child){
    if(child.type==='strong'){
        return (
            <strong>{child.value}</strong>
        );
    }else if(child.type==='em'){
        return (
            <em>{child.value}</em>
        );
    }else if(child.type==='strong&em'){
        return (
            <strong><em>{child.value}</em></strong>
        );
    }else{
        return (
            <span>{child.value}</span>
        );
    }
}