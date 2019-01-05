import * as React from 'react';
import {Logger} from '../../logger/Logger';
import Button from 'reactstrap/lib/Button';
import {FlashcardType} from '../../metadata/FlashcardType';
import {FlashcardButtons} from './FlashcardButtons';
import {FlashcardTypeSelector} from './FlashcardTypeSelector';
import {RichTextArea} from '../RichTextArea';
import {RichTextMutator} from '../../apps/card_creator/elements/schemaform/RichTextMutator';
import {Elements} from '../../util/Elements';
import {FlashcardInputFieldsType, Styles, ClozeFields} from './FlashcardInput';

const log = Logger.create();

export class FlashcardInputForCloze extends React.Component<IProps, IState> {

    private fields: ClozeFields = {text: ""};

    private richTextMutator?: RichTextMutator;

    constructor(props: IProps, context: any) {
        super(props, context);

        this.onCreate = this.onCreate.bind(this);
        this.onCancel = this.onCancel.bind(this);

        this.state = {
            iter: 0,
        };

    }

    public render() {

        const { id } = this.props;

        return (

            <div id="annotation-flashcard-box" className="">

                <RichTextArea id={`text-${this.props.id}`}
                              autofocus={true}
                              onKeyDown={event => this.onKeyDown(event)}
                              onRichTextMutator={richTextMutator => this.richTextMutator = richTextMutator}
                              onChange={(html) => this.fields.text = html}/>

                {/*- quote annotation ... to copy the annotation text.*/}

                <div style={Styles.BottomBar}>

                    <div style={Styles.BottomBarItem}>

                        <FlashcardTypeSelector onChangeFlashcardType={flashcardType => this.onChangeType(flashcardType)}/>

                    </div>

                    <div style={Styles.BottomBarItem} className="ml-1">

                        <Button color="light"
                                size="sm"
                                onClick={() => this.onClozeDelete()}
                                className="ml-1 p-1 border">[…]</Button>

                    </div>


                    <div style={Styles.BottomBarItemRight}
                         className="text-right">

                        <FlashcardButtons onCancel={() => this.onCancel()}
                                          onCreate={() => this.onCreate()}/>

                    </div>

                </div>

            </div>

        );

    }

    private onClozeDelete(): void {

        // TODO: don't use the top level window but get it from the proper
        // event
        const sel = window.getSelection();
        const range = sel.getRangeAt(0);

        const wrapper = document.createElement('span');
        range.surroundContents(wrapper);

        const prefix = Elements.createElementHTML('{{c1:', 'span');
        const suffix = Elements.createElementHTML('}}', 'span');

        wrapper.parentNode!.insertBefore(prefix, wrapper);
        wrapper.parentNode!.insertBefore(suffix, wrapper.nextSibling);

        sel.removeAllRanges();

    }

    private onKeyDown(event: KeyboardEvent) {

        // if (event.key === "Escape") {
        //     this.toggle();
        // }
        console.log("FIXME: keyboard event", event);

        console.log("FIXME: CONTROL", event.getModifierState("Control"));
        console.log("FIXME: Shift", event.getModifierState("Shift"));
        console.log("FIXME: KeyC", event.key === "KeyC");

        if (this.isClozeKeyboardEvent(event)) {

            console.log("FIXME: cloze!!!");

            // this.onCreate();

        }


        if (event.getModifierState("Control") && event.key === "Enter") {
            this.onCreate();
        }

    }

    private isClozeKeyboardEvent(event: KeyboardEvent) {

        return event.getModifierState("Control") &&
            event.getModifierState("Shift") &&
            event.key === "C";
    }

    private onChangeType(flashcardType: FlashcardType) {
        this.props.onFlashcardChangeType(flashcardType);
    }

    private onCreate(): void {

        if (this.props.onFlashcardCreated) {
            this.props.onFlashcardCreated(FlashcardType.CLOZE, this.fields);
        }

        this.reset();

        this.setState({
            iter: this.state.iter + 1
        });

    }

    private onCancel(): void {

        if (this.props.onCancel) {
            this.props.onCancel();
        }

        this.reset();

    }

    private reset(): void {
        this.fields = {text: ""};
    }


}

export interface IProps {
    readonly id: string;
    readonly onFlashcardCreated: (flashcardType: FlashcardType, fields: Readonly<FlashcardInputFieldsType>) => void;
    readonly onFlashcardChangeType: (flashcardType: FlashcardType) => void;
    readonly onCancel?: () => void;
}

export interface IState {
    readonly iter: number;
}


