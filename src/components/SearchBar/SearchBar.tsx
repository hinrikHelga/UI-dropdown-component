import React, { Component } from 'react';
import { TextField, InputAdornment, List, ListItem, ListItemText, Typography } from '@material-ui/core/';
import { Search } from '@material-ui/icons/';

import { userModel } from '../../models/userModel';
import '../../SearchBarCSS.css';

interface ISearchBarState {
    userList: Array<userModel>;
    userSuggestions: Array<userModel>; 
    inputString: string;
    activeIndex: number;
}

// Prevent case-sensitive
const stringCompare = (stringToCompare: string, inputValue: string): boolean => {
    return stringToCompare.toLowerCase().indexOf(inputValue.toLowerCase()) != -1
}

class SearchBar extends Component<{}, ISearchBarState> {
    constructor(props: {}) {
        super(props);
        this.state = {
            userList: [
                {
                  name: "Jón Þór Þórólfsson",
                  email: "jon@fyrirtaekjalausnir.is",
                  ssn: "1758001830"
                },
                {
                  name: "Geir Hannes Björnsson",
                  email: "geir@bankastarfsemi.com",
                  ssn: "2849003620"
                },
                {
                  name: "Geirþrúður Björk Gunnarsdóttir",
                  email: "geirthrudur@opinberstofnun.is",
                  ssn: "1738005027"
                },
                {
                  name: "Haraldur Fjólmundssson",
                  email: "halli@fjarmalastofnun.is",
                  ssn: "2847003900"
                },
                {
                  name: "Birgitta Líf Brjánsdóttir",
                  email: "birgitta@aviato.is",
                  ssn: "1738005027"
                },
                {
                  name: "Gunnleifur Geirfinnsson",
                  email: "gunnig@bigcorpehf.is",
                  ssn: "1502008492"
                },
                {
                  name: "Birgir Ben Brjánsson",
                  email: "biggi@stofnanaeftirlitid.is",
                  ssn: "2758001830"
                }
            ],
            userSuggestions: [],
            inputString: "",
            activeIndex: 0,
        }
    }

    makeBold = (fullString: string, substring: string) => {
        var final: React.ReactElement[] = [];
        var lastIndex = 0;
        let regex = new RegExp(substring, "gi");
        var matches = fullString.matchAll(regex);

        // Regex matches the input value given in filter function
        // So no worries for match.index being possibly undefined, because we know all records contain the substring
        // Sorry for ts-ignore, would not put in production code :)
        for(const match of matches){
            final.push(<>{fullString.slice(lastIndex, match.index)}</>);
            // @ts-ignore
            final.push(<b>{fullString.slice(match.index, match.index + substring.length)}</b>);
            // @ts-ignore
            lastIndex = match.index + substring.length;
        }
        final.push(<>{fullString.slice(lastIndex)}</>);
        return <span>{
            final
        }</span>
    }
    
    handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        let suggestions: Array<userModel> = []
        if (value.length > 0) {
            // Sort data and filter from input
            suggestions = this.state.userList.sort(
                function(a: userModel, b: userModel) 
                { return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0); })
                // filter by name or email from input
                .filter(user => ( stringCompare(user.name, value) || stringCompare(user.email, value) ));
        }
        this.setState({ userSuggestions: suggestions, inputString: value })
    }

    handleOnKeyDown = (e: React.KeyboardEvent) => {
        const { activeIndex, userSuggestions } = this.state
        // arrow down selects next user from dropdown list
        if (e.keyCode === 38 && activeIndex > 0) {
            this.setState( prevState => ({
              activeIndex: prevState.activeIndex - 1
            }))
            // arrow up selects previous user in dropdown list
          } else if (e.keyCode === 40 && activeIndex < userSuggestions.length - 1) {
            this.setState( prevState => ({
              activeIndex: prevState.activeIndex + 1
            }))
            // press enter selects user
          } else if (e.keyCode === 13) {
              this.selectUser(this.state.activeIndex);
              // Do something with selected user
          }
    }

    handleHover = (index: number) => {
        this.setState({ activeIndex: index })
    }

    selectUser = (index: number) => {
        let user: userModel = this.state.userSuggestions[index];
        this.setState(() => ({
            inputString: "",
            userSuggestions: []

        }))
        console.log("selected user: " , user);
        // Do something with selected user...
    }

    displaySuggestions = () => {
        const { activeIndex, userSuggestions } = this.state;
        if (userSuggestions === null) {
            return null;
        }
        return (
            <List className="list">
                { 
                    this.state.userSuggestions.length > 0
                ?  
                    this.state.userSuggestions.map((user, i) => 
                    <ListItem className="listitem" onClick={ () => this.selectUser(i) } onMouseOver={() => this.handleHover(i)}> 
                        <ListItemText 
                            className={ activeIndex === i ? 'active' : '' } 
                            primary= { this.makeBold(user.name, this.state.inputString) }
                            secondary={ this.makeBold(user.email, this.state.inputString) }/>
                    </ListItem>)
                :   

                    <ListItem>
                        <ListItemText className="listitem" primary="Engar niðurstöður"/>
                    </ListItem> 
                }
            </List>
        )
    }

    render(): React.ReactElement {
        const { inputString } = this.state;
        return (
            <div className="AutoCompleteText">
                <TextField
                    onKeyDown={this.handleOnKeyDown}
                    value={inputString}
                    placeholder={"Þekktir viðtakendur"}
                    variant={"outlined"}
                    onChange={this.handleOnChange}
                    fullWidth
                    InputProps={{
                    startAdornment: (
                    <InputAdornment position="start">
                        <Search />
                    </InputAdornment>
                    ),
                }}/>
                { this.state.inputString.length > 0 && this.displaySuggestions() }
            </div>
        );
    }
} 

export default SearchBar;